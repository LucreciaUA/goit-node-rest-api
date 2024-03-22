import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import  Contacts from "../schemas/contactsSchemas.js";

export const getAllContacts = async(req, res) => {
    try {
        const { _id: owner } = req.user;
        const result = await Contacts.find({ owner })
        .populate("owner", "email");
        
    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting contacts:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getOneContact = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id: owner } = req.user;
        const contact = await Contacts.findById(id)
                                        .populate("owner", "name email")
                                        .where("owner")
                                        .equals(owner);
        
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteContact = async(req, res) => {
    try {
        const { id } = req.params;
        const { _id: owner } = req.user;
       const contact = await Contacts.findByIdAndDelete(id)
                                        .populate("owner", "name email")
                                        .where("owner")
                                        .equals(owner);;
        
        res.status(200).json(contact);
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createContact = async(req, res) => {
    try {
        const { name, email, phone } = req.body;
        const { _id: owner } = req.user;
        const validationResult = createContactSchema.validate({
            name: name,
            email: email,
            phone: phone
        });
        console.log(req.body)
      if (validationResult.error) {
       return res.status(400).json({ message: validationResult.error.message });
      }

       const contacts = await Contacts.create({name, email, phone, owner} );
        
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateContact = async(req, res) => {
    try {
        const { id } = req.params;
         const { _id: owner } = req.user;
        const { name, email, phone } = req.body;
        const validationResult = updateContactSchema.validate({
            name: name,
            email: email,
            phone: phone});
        if (validationResult.error) {
            return res.status(400).json({ message: validationResult.error.message });
        }
    const contacts = await Contacts.findByIdAndUpdate(id, { name, email, phone }).where("owner")
      .equals(owner);

        
        res.status(200).json(contacts);
    } catch (error) {
         console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateStatusContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id: owner } = req.user;

        const contact = await Contacts.findById(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        if (contact.owner.toString() !== owner) {
            return res.status(403).json({ message: 'Unauthorized to update this contact' });
        }
        contact.favorite = !contact.favorite;

        const updatedContact = await contact.save();

        res.status(200).json(updatedContact);

    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
