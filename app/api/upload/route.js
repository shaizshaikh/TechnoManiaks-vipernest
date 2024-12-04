import { BlobServiceClient } from '@azure/storage-blob';
import { NextResponse } from 'next/server';

const getBlobServiceClient = () => {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    console.error('Azure connection string is missing');
    throw new Error('Azure connection string is missing');
  }
  return BlobServiceClient.fromConnectionString(connectionString);
};

export async function POST(req) {
  try {
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file');
    const mimeType = formData.get('mimeType');  // Get the user-provided MIME type

    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    console.log('File details:', { name: file.name, type: file.type });
    console.log('Received MIME Type:', mimeType); // Log received MIME type

    // Generate a unique blob name to prevent conflicts
    const blobName = `${Date.now()}-${file.name}`;

    // Initialize the BlobServiceClient
    const blobServiceClient = getBlobServiceClient();

    // Get the container client (ensure the container name is set in your .env file)
    const containerName = process.env.AZURE_CONTAINER_NAME;
    if (!containerName) {
      console.error('Azure container name is missing');
      throw new Error('Azure container name is missing');
    }

    console.log('Container name:', containerName);

    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Check if the container exists, create if it doesn't
    const exists = await containerClient.exists();
    if (!exists) {
      console.log('Container does not exist, creating...');
      await containerClient.create();
    } else {
      console.log('Container exists.');
    }

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log('Uploading file to blob storage...');

    // Convert file to ArrayBuffer and upload
    const fileArrayBuffer = await file.arrayBuffer();  // Convert file to ArrayBuffer
    const buffer = Buffer.from(fileArrayBuffer);  // Convert ArrayBuffer to Buffer

    // Use user-provided MIME type if available, otherwise fallback to file type
    const contentType = mimeType || file.type;
    console.log('Final Content Type to Upload:', contentType); // Log the content type to be uploaded

    // Upload the file
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: contentType }, // Set the content type based on user input or file type
    });

    console.log('Upload successful!');
    return NextResponse.json({ message: 'Upload successful!', blobName }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/upload:', error);
    return NextResponse.json({ message: `Upload failed: ${error.message}` }, { status: 500 });
  }
}
