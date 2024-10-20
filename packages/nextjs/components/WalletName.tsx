import React, { useEffect, useState } from "react";
import NameStoneUtils from "../utils/NameStoneUtils";

interface WalletNameProps {
  address: string;
}

const WalletName: React.FC<WalletNameProps> = ({ address }) => {
  const [displayName, setDisplayName] = useState<string>(address);

  useEffect(() => {
    const fetchName = async () => {
      console.log("About to get name for: " + address);
      const name = await NameStoneUtils.getName(address);
      console.log("Name found is: " + name);
      if (name) {
        setDisplayName(name);
      } else {
        setDisplayName(address);
      }
    };

    fetchName();
  }, [address]);

  return (
    <span
      className="wallet-name"
      style={{
        fontFamily: "monospace",
      }}
    >
      {displayName}
    </span>
  );
};

export default WalletName;
