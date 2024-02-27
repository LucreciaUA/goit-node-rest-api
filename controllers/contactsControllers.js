import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async(req, res) => {
    try {
        const contacts = await contactsService.listContacts();
        
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const getOneContact = async(req, res) => {
    try {
        const { id } = req.params;
        
        const contact = await contactsService.getContactById(id);
        
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteContact = async(req, res) => {
    try {
        const { id } = req.params;
        const contact = await contactsService.removeContact(id);
        
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createContact = async(req, res) => {
    try {
        const { name, email, phone } = req.body;
        const validationResult = createContactSchema.validate({
            name: name,
            email: email,
            phone: phone
        });
        console.log(req.body)
      if (validationResult.error) {
       return res.status(400).json({ message: validationResult.error.message });
      }

        const contacts = await contactsService.addContact(name, email, phone );
        
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateContact = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        const validationResult = updateContactSchema.validate({
            name: name,
            email: email,
            phone: phone});
        if (validationResult.error) {
            return res.status(400).json({ message: validationResult.error.message });
        }
    const contacts = await contactsService.updateContact(name, email, phone, id);
        
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

