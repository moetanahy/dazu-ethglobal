import React, { useEffect, useState } from "react";
import NameStoneUtils from "../utils/NameStoneUtils";

interface WalletNameProps {
  address: string;
}

const WalletName: React.FC<WalletNameProps> = ({ address }) => {
  const [displayName, setDisplayName] = useState<string>(address);

  useEffect(() => {
    const fetchName = async () => {
      const name = await NameStoneUtils.getName(address);
      if (name) {
        setDisplayName(name);
      } else {
        setDisplayName(address);
      }
    };

    fetchName();
  }, [address]);

  return (
    <div
      className="wallet-name"
      style={{
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        display: "inline-block",
        fontFamily: "monospace",
      }}
    >
      {displayName}
    </div>
  );
};

export default WalletName;
