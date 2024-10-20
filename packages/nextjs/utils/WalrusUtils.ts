import axios from "axios";

export class WalrusUtils {
  // Constants for public publisher and aggregator
  private static readonly PUBLIC_PUBLISHER =
    "https://cors-anywhere.herokuapp.com/https://walrus-testnet-publisher.nodes.guru";
  private static readonly PUBLIC_AGGREGATOR = "https://cors-anywhere.herokuapp.com/http://walrus.krates.ai:9000";

  /**
   * Stores a file in a blob using the Walrus publisher API.
   * @param fileContent The content of the file to be stored as a Uint8Array.
   * @returns Promise<string> The blob ID of the stored file.
   */
  public static async store(fileContent: Uint8Array): Promise<string> {
    try {
      const response = await axios.put(`${this.PUBLIC_PUBLISHER}/v1/store?epochs=5`, fileContent, {
        headers: { "Content-Type": "application/octet-stream" },
      });

      if (response.status === 200) {
        const blobId = response.data.alreadyCertified?.blobId || response.data.newlyCreated?.blobObject?.id || null;
        return blobId;
      } else {
        throw new Error("Failed to store blob: Invalid response");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to store blob: ${error.response?.data || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Retrieves a blob using the blob ID from the Walrus aggregator API.
   * @param blobId The ID of the blob to retrieve.
   * @returns Promise<Uint8Array> The content of the retrieved blob.
   */
  public static async read(blobId: string): Promise<Uint8Array> {
    try {
      const response = await axios.get(`${this.PUBLIC_AGGREGATOR}/v1/${blobId}`, {
        responseType: "arraybuffer",
      });

      if (response.status === 200) {
        return new Uint8Array(response.data);
      } else {
        throw new Error("Failed to read blob: Invalid response");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to read blob: ${error.response?.data || error.message}`);
      }
      throw error;
    }
  }
}
