// @ts-nocheck
import {Request, Response} from 'express';
import User  from '../models/userModel';
import Tool from '../models/toolModel';
import cloudinary from '../helper/imageUpload';
import algoliasearch from 'algoliasearch';


const client = algoliasearch(process.env.ANGOLIA_APPLICATION_ID, process.env.ANGOLIA_ADMIN_APIKEY);
const index = client.initIndex('Createcamp');


export const searchToolsWithAlgolia = async (req: Request, res: Response) => {
  try {
      const { query } = req.query;
      
      const results = await index.search(query as string, {
          hitsPerPage: 10,
      });

      res.status(200).json({ tools: results.hits });
  } catch (error) {
      console.error('Error searching tools with Algolia:', error);
      res.status(500).json({ message: error });
  }
}

export const createNewTool = async (req, res) => {
    try {
      const publisher = req.user?._id;
  
      if (!req.files || (!req.files.screenshots && !req.files.logo)) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
  
      const uploadedImages = [];
      let logoUrl = '';

      if (req.files.logo) {
        try {
            const result = await cloudinary.uploader.upload(req.files.logo[0].path, {
                public_id: `${publisher}_tool_logo_${req.files.logo[0].originalname}`,
                width: 500,
                height: 500,
                crop: 'fill'
            });
            logoUrl = result.secure_url;
        } catch (err) {
            console.error('Error uploading logo to Cloudinary:', err);
            return res.status(500).json({ message: err });
        }
    }

    if (req.files.screenshots) {
      for (const file of req.files.screenshots) {
          try {
              const result = await cloudinary.uploader.upload(file.path, {
                  public_id: `${publisher}_tool_screenshot_${file.originalname}`,
                  width: 500,
                  height: 500,
                  crop: 'fill'
              });
              uploadedImages.push(result.secure_url);
          } catch (err) {
              console.error('Error uploading screenshot to Cloudinary:', err);
              return res.status(500).json({ message: 'Error uploading screenshots' });
          }
      }
    }
  
      const toolData = {
        name: req.body.name,
        description: req.body.description,
        features: req.body.features ? JSON.parse(req.body.features) : [],
        pricing: req.body.pricing,
        productType: req.body.productType,
        categories: req.body.categories ? req.body.categories.split(',') : [],
        productLink:req.body.productLink,
        youtubeLink:req.body.youtubeLink,
        targetAudience: req.body.targetAudience ? req.body.targetAudience.split(',') : [],
        aiEnabled: req.body.aiEnabled === 'true',
        isActive: req.body.isActive === 'true',
        publisher: req.user._id,
        screenshots: uploadedImages,
        logo: logoUrl
      };
  
      const newTool = new Tool(toolData);
      await newTool.save();

      await index.saveObject({
        objectID: newTool._id,
        name: newTool.name,
        description: newTool.description,
        categories: newTool.categories,
        pricing: newTool.pricing,
        productType: newTool.productType
      });
      res.status(201).json(newTool);
    } catch (error) {
      console.error('Error creating tool:', error);
      res.status(500).json({ message: `Internal server error,  ${error}` });
    }
  };
  
  
  


//update tool
export const updateTool = async (req: Request, res: Response) => {
    const toolId = req.params.toolId;
    const userId = req.user?._id;

    try {   
        const existingTool = await Tool.findById(toolId);
        console.log(existingTool, 'existing Tool')
        if (!existingTool) {
            return res.status(404).json({ message: 'Tool not found' });
        }

        if (!existingTool.publisher.equals(userId)) {
            return res.status(403).json({ message: 'You do not have permission to update this tool' });
        }

        const { name, description, features, screenshots, pricing, categories, targetAudience,productLink, youtubeLink, logo} = req.body;

        existingTool.name = name !== undefined ? name : existingTool.name;
        existingTool.description = description !== undefined ? description : existingTool.description;
        existingTool.features = features !== undefined ? features : existingTool.features;
        existingTool.screenshots = screenshots !== undefined ? screenshots : existingTool.screenshots;
        existingTool.logo = logo !== undefined ? logo : existingTool.logo;
        existingTool.pricing = pricing !== undefined ? pricing : existingTool.pricing;
        existingTool.categories = categories !== undefined ? categories : existingTool.categories;
        existingTool.productLink = productLink !== undefined ? productLink : existingTool.productLink;
        existingTool.targetAudience = targetAudience !== undefined ? targetAudience : existingTool.targetAudience;
        existingTool.youtubeLink = youtubeLink !== undefined ? youtubeLink : existingTool.youtubeLink;
        existingTool.updatedAt = new Date();
      

    
        const updatedTool = await existingTool.save();
        await index.saveObject({
          objectID: updatedTool._id,
          name: updatedTool.name,
          description: updatedTool.description,
          categories: updatedTool.categories,
          pricing: updatedTool.pricing,
        });

        res.status(200).json({ message: 'Tool updated successfully', tool: updatedTool });
    } catch (error) {
        console.error('Error updating tool:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 

//get all tools
export const getAllToolListings = async (req: Request, res: Response) => {
    try {
        const tools = await Tool.find({ isActive: { $ne: false } }).populate('reviews');
        res.status(200).json({ tools });
    } catch (error) {
        console.error('Error retrieving tool listings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getSaasTools = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const parsedPage = parseInt(page, 20);
        const parsedLimit = parseInt(limit, 20);
    
        const startIndex = (parsedPage - 1) * parsedLimit;
    
        let saasToolsQuery = Tool.find({ productType: { $in: ['saas', 'Saas'] } });
    
        const total = await Tool.countDocuments({ productType: { $in: ['saas', 'Saas'] } });
    
        saasToolsQuery = saasToolsQuery.skip(startIndex).limit(parsedLimit);
        const tools = await saasToolsQuery.exec();
    
        const pagination = {
          currentPage: parsedPage,
          totalPages: Math.ceil(total / parsedLimit),
          totalItems: total
        };

        res.status(200).json({ tools, pagination });
      } catch (error) {
        console.error('Error retrieving Saas tools:', error);
        res.status(500).json({ message: 'Server error' });
      }
};



export const filterSaasTools = async (req, res) => {
  try {
    // Destructure query parameters with default values
    const {
      page = 1,
      limit = 20,
      sortBy,
      sortOrder = 'asc',
      category
    } = req.query;

    // Convert page and limit to integers
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);

    // Build query conditions dynamically
    const filterConditions = {
      productType: { $in: ['saas', 'Saas'] },
    };

    if (category) {
      filterConditions.categories = category;
    }

    // Sorting options mapping
    const sortOptions = {
      AI: { aiEnabled: sortOrder === 'desc' ? -1 : 1 },
      pricesHigh: { pricing: -1 },
      pricesLow: { pricing: 1 },
      recentlyAdded: { createdAt: -1 },
      bestReviews: { averageReviewScore: -1 },
      bestUpvotes: { totalUpvotes: -1 }
    };

    // Default to sorting by creation date if `sortBy` is not provided
    const sort = sortOptions[sortBy] || { createdAt: -1 };

    // Using aggregation to count and fetch in one query
    const tools = await Tool.aggregate([
      { $match: filterConditions },
      { $sort: sort },
      { $skip: (pageInt - 1) * limitInt },
      { $limit: limitInt }
    ]);

    // Get the total number of items
    const total = await Tool.countDocuments(filterConditions);

    // Calculate pagination
    const pagination = {
      currentPage: pageInt,
      totalPages: Math.ceil(total / limitInt),
      totalItems: total
    };

    res.status(200).json({ tools, pagination });
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ message: 'Server error' });
  }
};





export const getapps = async (req: Request, res: Response) => {
    try {
        const { page = req.query.page ? parseInt(req.query.page as string, 20) : 1,
            limit = 10 } = req.query;

        const startIndex = (page - 1) * limit;

        let appsToolsQuery = Tool.find({ productType: { $in: ['app', 'app'] } });

        const total = await Tool.countDocuments({ productType: { $in: ['app', 'App'] } });

        appsToolsQuery = appsToolsQuery.skip(startIndex).limit(limit);
        const tools = await appsToolsQuery.exec();

        // Pagination metadata
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        };

        res.status(200).json({ tools, pagination });
    } catch (error) {
        console.error('Error retrieving Saas tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const filterApps = async (req, res) => {
    try {
        const {
          page = req.query.page ? parseInt(req.query.page, 10) : 1,
          limit = req.query.limit ? parseInt(req.query.limit, 10) : 10,
          sortBy,
          sortOrder = 'asc',
          category
        } = req.query;
    
        let query = Tool.find({
          productType: { $in: ['app', 'App'] },
          categories: category ? category : { $exists: true }
        });
    
        if (sortBy) {
          switch (sortBy) {
            case 'AI':
              query = query.sort({ aiEnabled: sortOrder === 'desc' ? -1 : 1 });
              break;
            case 'pricesHigh':
              query = query.sort({ pricing: -1 });
              break;
            case 'pricesLow':
              query = query.sort({ pricing: 1 });
              break;
            case 'recentlyAdded':
              query = query.sort({ createdAt: -1 });
              break;
            case 'bestReviews':
              query = query.sort({ averageReviewScore: -1 });
              break;
            case 'bestUpvotes':
              query = query.sort({ totalUpvotes: -1 });
              break;
            default:
              break;
          }
        }
    
        const startIndex = (page - 1) * limit;
        const total = await Tool.countDocuments({
          productType: { $in: ['app', 'App'] },
          categories: category ? category : { $exists: true }
        });
    
        query = query.skip(startIndex).limit(limit);
        const tools = await query.exec();
    
        const pagination = {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total
        };
    
        res.status(200).json({ tools, pagination });
      } catch (error) {
        console.error('Error fetching tools:', error);
        res.status(500).json({ message: 'Server error' });
      }
};



export const getCourses = async (req: Request, res: Response) => {
    try {
        const { page = req.query.page ? parseInt(req.query.page as string, 20) : 1,
            limit = 10 } = req.query;

        const startIndex = (page - 1) * limit;

        let coursesQuery = Tool.find({ productType: { $in: ['course', 'Course'] } });

        const total = await Tool.countDocuments({ productType: { $in: ['course', 'Course'] } });

        coursesQuery = coursesQuery.skip(startIndex).limit(limit);
        const courses = await coursesQuery.exec();

        // Pagination metadata
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        };

        res.status(200).json({ courses, pagination });
    } catch (error) {
        console.error('Error retrieving Saas tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 

export const filterCourses = async (req, res) => {
    try {
        const { page = req.query.page ? parseInt(req.query.page as string, 20) : 1,
                limit = 10,
                sortBy,
                sortOrder,
                category 
            } = req.query;

            let query = Tool.find({ 
                productType: { $in: ['course', 'Course'] }, 
                categories: category ? category : { $exists: true } // Filter by category if provided
            });

        if (sortBy) {
            switch (sortBy) {
                case 'AI':
                    query = query.sort({ aiEnabled: sortOrder === 'desc' ? -1 : 1 });
                    break;
                case 'pricesHigh':
                    query = query.sort({ pricing: -1 });
                    break;
                case 'pricesLow':
                    query = query.sort({ pricing: 1 });
                    break;
                case 'recentlyAdded':
                    query = query.sort({ createdAt: -1 });
                    break;
                case 'bestReviews':
                    query = query.sort({ averageReviewScore: -1 });
                    break;
                case 'bestUpvotes':
                    query = query.sort({ totalUpvotes: -1 });
                    break;
                default:
                    break;
            }
        }

        
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Tool.find({ 
            productType: { $in: ['course', 'Course'] }, 
            categories: category ? category : { $exists: true } // Filter by category if provided
        }).countDocuments();

        query = query.skip(startIndex).limit(limit);
        const tools = await query.exec();

        // Pagination metadata
        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total
        };

        res.status(200).json({ tools, pagination });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//delete a tool
export const deleteTool = async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const toolId = req.params.toolId;
    try {
        const existingTool = await Tool.findById(toolId);
        if (!existingTool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        if (!existingTool.publisher.equals(userId)) {
            return res.status(403).json({ message: 'You do not have permission to update this tool' });
        }
        await Tool.findByIdAndDelete(toolId);
        await index.deleteObject(toolId);
        res.status(200).json({ message: 'Tool listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting tool listing:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getToolDetails = async (req: Request, res: Response) => {
    try {
        const toolId = req.params.toolId;

        const tool = await Tool.findById(toolId);
        if (!tool?.isActive) {
            res.status(500).json({ message: "This resource is currently under review" });
        }        

        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        res.status(200).json({ tool });
    } catch (error) {
        console.error('Error fetching tool details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


//For this, you'd have to create a search index on the field you wish to search, to be done in mongo db atlas
export const searchTools = async (req: Request, res: Response) => {
    try {
      // Build search query
      const { name, pricing} = req.query;
  
      let searchQuery:any = {};
  
      if (name) {
        searchQuery.name = name.toString();
      }

      if (pricing) {
        searchQuery.pricing = parseInt(pricing.toString()); // Convert the 'pricing' parameter to a number and add it to the search query
    }
      
    console.log(searchQuery,"Search query")
      const tools = await Tool.find(searchQuery);
      console.log(tools)
  
      // Return the list of matching tools
      res.status(200).json({ tools });
    } catch (error) {
      console.error('Error searching tools:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  //get Publisher Info
  export const getpublisher = async (req: Request, res: Response) => {
    try {
        const toolId = req.params.toolId;
        const tool = await Tool.findById(toolId);

        if (!tool) {
            return res.status(404).json({ message: 'Tool not found' });
        }
        const publisher = await User.findById(tool.publisher);
        if (!publisher) {
            return res.status(404).json({ message: 'Product lister not found' });
        }
        res.status(200).json({ publisher });
    } catch (error) {
        console.error('Error fetching product lister:', error);
        res.status(500).json({ message: 'Server error' });
    }
};