# E-commerce backend

#### Roles, functionalities and permissions.

There are two possible roles in the dashboard **Administrator** and **Moderator**.

##### **Administrator**

This is the most important role and the one which has the most relevant functionalities and permissions in the application, these permissions serve to monitor and control the actions of the moderator(s).

###### Functionalities and permissions:

- Create, edit, send products to the trash and even delete products permanently.
- Create, edit, send users to the trash and even delete users permanently.
  - It should be noted that you can assign these users their role.
    - User.
    - Moderator.
    - Admin.
- Monitor from the records section all actions related to products and users carried out by yourself, another administrator or by moderators.
- If a product is deleted first it will be sent to the trash and from there only the administrator can delete them permanently, the same happens with the users but in this case only the administrator will be able to send them to the trash.
- Mark as sent the orders of the products by customers from the sales section.
- View the statistics of the number of products, users, sales, registrations.

##### **Moderator**

This role is more for an assistant or collaborator in the dashboard, he has sufficient permissions to carry out very important collaborative activities, but in most cases if he makes an error it will be recorded and if he deletes a product by mistake, that error will not be permanent.

###### Functionalities and permissions:

- Create, edit and send products to trash.
- Mark as sent the orders of the products by customers from the sales section.
- See only the statistics of the number of products and sales on the home page

## instalación

First install the dependencies and then start the local server.

```sh
$ clone the repo
$ cd repo
$ npm i
$ nodemon app
```

It should be noted that we must have the following environment variables configured.

```sh
PORT= (Port number on which the server will run locally)

MONGODB_CNN= (Mongodb database url)

SECRETORPRIVATEKEY= (Encryption key for JWT Tokens)

GOOGLE_CLIENT_ID= (Information provided by the Google API)

CLOUDINARY_URL= (Information provided by the Cloudinary API)


```
