
const Item = require('../models/crudModel');

class CrudControllers{

    static async getItems(req, res){
        try {
            const items = await Item.find();
            return res.status(200).json({
                status: 200,
                success: true,
                message: "items fetched successfully",
                data: items
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
            });
        }
    }

    static async postItems(req, res){
        try {
            const userName = await Item.findOne({name: req.body.name})
            if(userName){
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: "item already exists",
                });
            }
            const items = new Item({
                name: req.body.name,
                description: req.body.description,
                trigger: req.body.trigger
            })
             await items.save();
            return res.status(200).json({
                status: 200,
                success: true,
                message: "items saved successfully",
                data: items
            });
        } catch (error) {
            if (error.name === 'ValidationError') {
                // Handle validation errors
                const errorMessages = Object.values(error.errors).map(err => err.message);
                res.status(400).json({
                  status: 400,
                  success: false,
                  message: 'Validation Error',
                  errors: errorMessages,
                });
              } else {
                // Handle other errors
                console.error('error', error);
                res.status(500).json({
                  status: 500,
                  success: false,
                  message: 'Internal server error',
                });
              }
        }
    }

    static async deleteItems(req, res){
        try{
            const itemOne = await Item.findById(req.params.id);
            if(!itemOne){
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "items not found",
                });
            }
            
            const items = await Item.findByIdAndDelete(req.params.id);
            console.log('items', items, req.params.id)
            return res.status(200).json({
                status: 200,
                success: true,
                message: "items deleted successfully",
                data: items
            });
        }
        catch(error){
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
            });
        }

    }


    static async updateItems(req, res){
        try{
            const userName = await Item.findOne({name: req.body.name})
            if(userName){
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: "item with this name already exists",
                });
            }
            const itemData = await Item.findById(req.params.id);
            if(!itemData){
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "items not found",
                });
            }
            // Object.assign(items, req.body);

            // await items.save();

            //or using run valistaions 
            const items = await Item.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true } // `runValidators` option ensures validation is applied
              );

            return res.status(200).json({
                status: 200,
                success: true,
                message: "items updated successfully",
                data: items
            });
        }
        catch(error){
            if (error.name === 'ValidationError') {
                const errorMessages = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                  status: 400,
                  success: false,
                  message: 'Validation Error',
                  errors: errorMessages,
                });
              } else {
                console.error('error', error);
                return res.status(500).json({
                  status: 500,
                  success: false,
                  message: 'Internal server error',
                });
              };
        }
}
}

module.exports = CrudControllers