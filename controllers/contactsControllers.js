//import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import Contacts, { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async(req, res) => {
    try {
    const result = await Contacts.find();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting contacts:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getOneContact = async(req, res) => {
    try {
        const { id } = req.params;
        
        const contact = await Contacts.findById(id);
        
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteContact = async(req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contacts.findByIdAndDelete(id);
        
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

        const contacts = await Contacts.create({name, email, phone} );
        
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
        const contacts = await Contacts.findByIdAndUpdate(id, { name, email, phone });
        console.log(contacts)
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateStatusContact = async (req, res) => {
    try {
        const { id } = req.params;
     

        const contact = await Contacts.findById(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        contact.favorite = !contact.favorite;

        const updatedContact = await contact.save();

        res.status(200).json(updatedContact);
        
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};