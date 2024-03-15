import express, {Request, Response} from 'express';
import User, {IUser} from '../models/userModel';
import Tool, {ITool} from '../models/toolModel';

export const createNewTool = async (req: Request, res: Response) => {
    try {
        const { name, description, features, screenshots, pricing, categories, targetAudience } = req.body;
        const publisher = req.params.userId;

        const newTool = new Tool({
            name,
            description,
            features,
            screenshots,
            pricing,
            categories,
            targetAudience,
            publisher:publisher
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
    try {        
        const toolId = req.params.toolId;

        const existingTool = await Tool.findById(toolId);
        if (!existingTool) {
            return res.status(404).json({ message: 'Tool not found' });
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
        const tools = await Tool.find();

        res.status(200).json({ tools });
    } catch (error) {
        console.error('Error retrieving tool listings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//delete a tool
export const deleteTool = async (req: Request, res: Response) => {
    try {
        const toolId = req.params.toolId;

        const existingTool = await Tool.findById(toolId);
        if (!existingTool) {
            return res.status(404).json({ message: 'Tool not found' });
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
      const { query, filters } = req.query;
  
      let searchQuery: {
        $text?: { $search: string };
        // Add other filter fields here based on your schema
        name?: string; // Example filter field for name
        price?: { $gte: number, $lte?: number }; // Example filter for price range
      } = {};
  
      if (query) {
        searchQuery.$text = { $search: query.toString() };
      }
  
      // Apply filters if provided
      if (filters) {
        const parsedFilters = JSON.parse(filters as string);
        const filteredSearchQuery : {
            $text?: { $search: string };
            name?: string;
            price?: { $gte: number; $lte?: number };
            [key: string]: any; // Index signature to allow arbitrary string keys
          } = { ...searchQuery }; // Clone to avoid mutation
  
        // Loop through parsed filters and add them to searchQuery with proper operators
        for (const [key, value] of Object.entries(parsedFilters)) {
          if (key === '_id') {
            // Handle _id separately (e.g., validation or error handling)
            continue; // Skip _id for now
          }
          filteredSearchQuery[key] = value; // Add other filter fields directly
        }
  
        searchQuery = filteredSearchQuery;
      }
  
      // Search for tools based on search query and filters
      const tools = await Tool.find(searchQuery);
  
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