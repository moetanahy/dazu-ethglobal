// import NameStone from "namestone-sdk";
import axios from "axios";

class NameStoneUtils {
  private static DOMAIN = "dazupay.eth";
  private static API_KEY = "037f4da9-82e7-43e1-a338-46c40d1fd715";
  private static BASE_URL = "/api/namestone";
  private static BASE_NO_CORS = "https://namestone.xyz/api/public_v1/set-name";
  private static nameCache: { [address: string]: string } = {};
  private static debug = false;
  private static debugArray: { [address: string]: string } = {
    "0xf75F4b46a43baF67e3c4DC27b89472a54E4f3aBE": "user1",
    "0xCB9b60B895fB14c940A8352289C5374829300548": "user2",
    "0x75f755B5B0ce1b15eeDc118B6Fe79d4f3DeD6De2": "user3",
  };

  //   private static NAME_STONE = new NameStone("037f4da9-82e7-43e1-a338-46c40d1fd715");

  /**
   * Sets the name of the logged-in user in NameStone
   * @param address The current logged-in wallet address
   * @param name The name to set for the user
   * @returns Promise<boolean> True if successful, false otherwise
   */
  public static async setName(address: string, name: string): Promise<boolean> {
    try {
      //   const { address } = useAccount();
      //   const addressAsString = address as string;
      //   const addressAsString = address.addre;
      console.log("setName about to be called with ", name, " for address ", address, "and with domain ", this.DOMAIN);
      const response = await axios.post(`${this.BASE_URL}/set-name`, {
        domain: this.DOMAIN,
        name: name.trim(),
        address: address,
      });
      console.log("setName called with ", name, " for address ", address, "and with domain ", this.DOMAIN);

      console.log("response", response);

      if (response.status === 200) {
        this.nameCache[address] = name;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error setting name:", error);
      return false;
    }
  }

  public static async claimName(address: string, name: string): Promise<boolean> {
    try {
      //   const { address } = useAccount();
      //   const addressAsString = address as string;
      //   const addressAsString = address.addre;
      console.log(
        "claimName about to be called with ",
        name,
        " for address ",
        address,
        "and with domain ",
        this.DOMAIN,
      );
      const response = await axios.post(`${this.BASE_URL}/claim-name`, {
        domain: this.DOMAIN,
        name: name,
        address: address,
      });
      console.log("claimName called with ", name, " for address ", address, "and with domain ", this.DOMAIN);

      console.log("response", response);

      if (response.status === 200) {
        this.nameCache[address] = name;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error claiming name:", error);
      return false;
    }
  }

  /**
   * Gets a user's name by their wallet address
   * @param address The wallet address to search for
   * @returns Promise<string | null> The user's name if found, null otherwise
   */
  public static async getName(address: string): Promise<string | null> {
    if (this.debug && this.debugArray[address]) {
      return this.debugArray[address];
    }

    console.log("getName called with address ", address);

    if (this.nameCache[address]) {
      console.log("is in namecache", this.nameCache[address]);
      return this.nameCache[address];
    }

    try {
      const response = await axios.get(`${this.BASE_URL}`, {
        params: {
          domain: this.DOMAIN,
          address: address,
        },
      });

      console.log("response", response);

      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        this.nameCache[address] = response.data[response.data.length - 1].name;
        return response.data[0].name;
      }

      return null;
    } catch (error) {
      console.error("Error getting name:", error);
      return null;
    }
  }

  public static async getAllNames(): Promise<Array<{ name: string; address: string }> | null> {
    console.log("getAllNames");

    try {
      const response = await axios.get(`${this.BASE_URL}`, {
        params: {
          domain: this.DOMAIN,
        },
      });

      console.log("response", response);

      if (response.status === 200 && Array.isArray(response.data)) {
        return response.data.map((item: any) => ({
          name: item.name,
          address: item.address,
        }));
      }

      return null;
    } catch (error) {
      console.error("Error getting names:", error);
      return null;
    }
  }
}

export default NameStoneUtils;
