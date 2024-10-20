import axios from "axios";

class NameStoneUtils {
  private static API_KEY = "037f4da9-82e7-43e1-a338-46c40d1fd715";
  private static BASE_URL = "https://api.namestone.xyz/v1";

  /**
   * Sets the name of the logged-in user in NameStone
   * @param address The current logged-in wallet address
   * @param name The name to set for the user
   * @returns Promise<boolean> True if successful, false otherwise
   */
  public static async setName(address: string, name: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/set_name`,
        {
          address,
          name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": this.API_KEY,
          },
        },
      );

      return response.status === 200;
    } catch (error) {
      console.error("Error setting name:", error);
      return false;
    }
  }

  /**
   * Searches for a user's name by their wallet address
   * @param address The wallet address to search for
   * @returns Promise<string | null> The user's name if found, null otherwise
   */
  public static async searchName(address: string): Promise<string | null> {
    try {
      const response = await axios.get(`${this.BASE_URL}/search_name`, {
        params: { address },
        headers: {
          "X-API-Key": this.API_KEY,
        },
      });

      if (response.status === 200 && response.data.name) {
        return response.data.name;
      }

      return null;
    } catch (error) {
      console.error("Error searching name:", error);
      return null;
    }
  }
}

export default NameStoneUtils;
