import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import { env } from "~/env.mjs";
import { BlobSASPermissions } from "@azure/storage-blob";

export const exampleRouter = createTRPCRouter({
  downloadFile: publicProcedure.mutation(async ({ input }) => {
    const accountName = env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName) throw Error("Azure Storage accountName not found");

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      env.AZURE_STORAGE_CONNECTION_STRING
    );

    const containerName = "devinda-test-1";

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create a unique name for the blob
    const blobName = "SUPER_SECRET_FILE.txt";

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const url = await blockBlobClient.generateSasUrl({
      permissions: BlobSASPermissions.parse("r"),
      expiresOn: new Date(new Date().valueOf() + 86400),
      contentType: "text/plain; charset=UTF-8",
      contentDisposition: "attachment",
    });

    return {
      success: true,
      url,
    };
  }),
});
