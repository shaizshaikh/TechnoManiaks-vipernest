  import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

export const uploadBlob = async (blobName, file) => {
  const containerName = "chino"; // Set the container name to chino

  try {
    // Create a BlobServiceClient
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    
    // Get a container client
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Check if the container exists
    const exists = await containerClient.exists();
    if (!exists) {
      // Create the container if it doesn't exist
      await containerClient.create();
      console.log(`Container ${containerName} created.`);
    } else {
      console.log(`Container ${containerName} already exists.`);
    }

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file
    await blockBlobClient.uploadBrowserFile(file);
    console.log(`Upload of ${blobName} successful!`);
  } catch (error) {
    console.error(`Error uploading blob: ${error.message}`);
    throw error; // Re-throw the error for further handling if needed
  }
};
