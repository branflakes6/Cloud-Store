# Cloud-Store
A cloud storage App built for an advanced Advanced Telecommunications, user data is encrypted and stored in a firebase storage bucket.


## Technical Description

1. User account created

   1. Public and private Keys are created for the user.
   2. The user's private key is encrypted with AES with the user's account.
   3. The public & encrypted private user key are stored with the user's account.
   4. The SECURE folder is created in Fire Base and the ID of the folder is stored with the user.

2. Group created

   1. Public and private keys are created for the group.
   2. The group private key is encrypted with the owner's public key
   3. The group public key is stored with the group and the encrypted private key is stored with the user and links back to the group.
   4. The group folder is created in the owner's folder and the group folder ID is stored with the group.

3. User added to group

   1. The user decrypts their own private key with their session.
   2. The user decrypts the group private key with their decrypted private key.
   3. The group private key is encrypted with public key of the user that is being added.
   4. The group folder is shared with the user through Fire Base

4. User removed from group

   1. The user's connection to the group is removed and their encrypted access to the group private key is removed.
   2. The user is unshared from the Fire Base bucket.

5. File Uploaded

   1. The file is encrypted with the group's public key on the upload.
   2. The file is uploaded to the group folder in Fire Base.

6. File Download
   1. The user decrypts their own private key with their session.
   2. The user decrypts the group private key with their decrypted private key.
   3. The decrypted group private key is then used decrypt the file.
   4. Decrypted file is then sent to the user.
