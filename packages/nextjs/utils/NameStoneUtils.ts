// import NameStone from "namestone-sdk";
import axios from "axios";

class NameStoneUtils {
  private static DOMAIN = "dazupay.eth";
  private static API_KEY = "037f4da9-82e7-43e1-a338-46c40d1fd715";
  private static BASE_URL = "https://cors-anywhere.herokuapp.com/https://namestone.xyz/api/public_v1";

  //   private static NAME_STONE = new NameStone("037f4da9-82e7-43e1-a338-46c40d1fd715");

  /**
   * Sets the name of the logged-in user in NameStone
   * @param address The current logged-in wallet address
   * @param name The name to set for the user
   * @returns Promise<boolean> True if successful, false otherwise
   */
  public static async setName(address: string, name: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/set-name`,
        {
          domain: this.DOMAIN,
          name: name,
          address: address,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.API_KEY,
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
      const response = await axios.get(`${this.BASE_URL}/get-names`, {
        params: {
          domain: this.DOMAIN,
          address: address,
        },
        headers: {
          "X-API-Key": this.API_KEY,
          Authorization: this.API_KEY,
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
