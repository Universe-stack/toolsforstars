// @ts-nocheck
import express, {Request, Response} from 'express';
import User, {IUser} from '../models/userModel';
import Tool, {ITool} from '../models/toolModel';


export const createNewTool = async (req: Request, res: Response) => {
    try {
        const { name, description, features, screenshots, pricing, categories, targetAudience, productType, aiEnabled } = req.body;
        const publisher = req.user?._id;
        console.log(publisher, 'publisher')

        const newTool = new Tool({
            name,
            description,
            features,
            screenshots,
            pricing,
            categories,
            aiEnabled,
            productType,
            targetAudience,
            publisher:publisher,
            publisherEmail:publisher
        });

        const savedTool = await newTool.save();

        res.status(201).json({ message: 'Tool listing created successfully', tool: savedTool });
    } catch (error) {
        console.error('Error creating tool listing:', error);
        res.status(500).json({ message: 'Server error' });
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

        const { name, description, features, screenshots, pricing, categories, targetAudience } = req.body;

        existingTool.name = name !== undefined ? name : existingTool.name;
        existingTool.description = description !== undefined ? description : existingTool.description;
        existingTool.features = features !== undefined ? features : existingTool.features;
        existingTool.screenshots = screenshots !== undefined ? screenshots : existingTool.screenshots;
        existingTool.pricing = pricing !== undefined ? pricing : existingTool.pricing;
        existingTool.categories = categories !== undefined ? categories : existingTool.categories;
        existingTool.targetAudience = targetAudience !== undefined ? targetAudience : existingTool.targetAudience;
        existingTool.updatedAt = new Date();
      

    
        const updatedTool = await existingTool.save();

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

// export const getSaasTools = async (req: Request, res: Response) => {
//     try {
//         const saasTools = await Tool.find({ productType: { $in: ['saas', 'Saas'] } });
//         res.status(200).json(saasTools);
//     } catch (error) {
//         console.error('Error retrieving Saas tools:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };


export const getSaasTools = async (req, res) => {
    try {
        const { page = req.query.page ? parseInt(req.query.page as string, 20) : 1,
                limit = 10,
                sortBy,
                sortOrder,
                category 
            } = req.query;

        let query = await Tool.find({ productType: { $in: ['saas', 'Saas'] } });

        // Apply filtering
        if (category) {
            query = query.where('category').equals(category);
        }

        // Apply sorting
        // let sortCriteria;
        
        // if (sortBy) {
        //     sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
        //     query = query.sort(sortCriteria);
        // }

        // switch (sortBy) {
        //     case 'AI':
        //         sortCriteria = { aiEnabled: sortOrder === 'desc' ? -1 : 1 };
        //         break;
        //     case 'pricesHigh':
        //         sortCriteria = { price: -1 }; 
        //         break;
        //     case 'pricesLow':
        //         sortCriteria = { price: 1 }; 
        //         break;
        //     case 'recentlyAdded':
        //         sortCriteria = { createdAt: -1 };
        //         break;
        //     case 'bestReviews':
        //         sortCriteria = { averageReviewScore: -1 }; 
        //         break;
        //     case 'bestUpvotes':
        //         sortCriteria = { totalUpvotes: -1 };
        //         break;
        //     default:
        //         sortCriteria = { _id: 1 }
        // }
        
        // if (Object.keys(sortCriteria) {
        //     query = query.sort(sortCriteria);
        // }
        
        // Apply pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Tool.countDocuments();

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
        console.error('Error fetching tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
};




export const getapps = async (req: Request, res: Response) => {
    try {
        const appTools = await Tool.find({ productType: { $in: ['apps', 'Apps'] } });
        res.status(200).json(appTools);
    } catch (error) {
        console.error('Error retrieving app tools:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCourses = async (req: Request, res: Response) => {
    try {
        const courses = await Tool.find({ productType: { $in: ['courses', 'Courses'] } });
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error retrieving Courses:', error);
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