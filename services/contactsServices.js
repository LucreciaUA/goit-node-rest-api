import { promises as fs } from 'fs';
import crypto from 'crypto';
import path from 'path';

const __dirname = path.resolve(path.dirname(''));

const contactsPath = path.join(__dirname, 'db', 'contacts.json');


const contactsService = {
    async listContacts() {
      
            const data = await fs.readFile(contactsPath, 'utf8');
            
            return JSON.parse(data);

    },

    async getContactById(contactId) {

            const data = await this.listContacts();
        const contact = data.find((item) => item.id === contactId);
        console.log(contact)
            return contact ? contact : null;

    },

    async removeContact(contactId) {

            const data = await this.listContacts();
            const deleted = await this.getContactById(contactId);
            const index = data.findIndex((item) => item.id === contactId);

            if (index !== -1) {
                data.splice(index, 1);
                await fs.writeFile(contactsPath, JSON.stringify(data, null, 2), 'utf8');
                return deleted;
            } else {
                return null;
            }

    },

    async addContact(name, email, phone) {

        const data = await this.listContacts();
        console.log(data)
        const exists = data.some((item) => {
             return (
        item.name.toLowerCase() === name.toLowerCase() ||
            item.email.toLowerCase() === email.toLowerCase() ||
            item.phone === phone
    );
        });
        
        console.log(exists)

            if (exists) {
                return null;
            }

            const contact = {
                id: crypto.randomUUID(),
                name: name,
                email: email,
                phone: phone,
            };

            const newData = [...data, contact];
            await fs.writeFile(contactsPath, JSON.stringify(newData, null, 2), 'utf8');

            return contact;
    },

    async updateContact(name, email, phone, id) {
        const data = await this.listContacts();
         
            const index = data.findIndex((item) => item.id === id);


        if (index === -1) {
            return null;
        }

        
        const updatedContact = {
            id: id,
            name: name || data[index].name, 
            email: email || data[index].email, 
            phone: phone || data[index].phone, 
        };

        data[index] = updatedContact;

      
        await fs.writeFile(contactsPath, JSON.stringify(data, null, 2), 'utf8');

        return updatedContact;
    }
    
};

contactsService.listContacts()

export default contactsService;