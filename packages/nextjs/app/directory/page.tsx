"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import NameStoneUtils from "~~/utils/NameStoneUtils";

// import { MetaHeader } from "~~/components/MetaHeader";

const DirectoryPage: NextPage = () => {
  const [namesList, setNamesList] = useState<Array<{ name: string; address: string }>>([]);

  useEffect(() => {
    const fetchNames = async () => {
      const names = await NameStoneUtils.getAllNames();
      if (names && Array.isArray(names)) {
        setNamesList(names);
      }
    };

    fetchNames();
  }, []);

  return (
    <>
      {/* <MetaHeader title="Directory" description="Directory page" /> */}
      <div className="flex items-center flex-col flex-grow pt-10">
        <h1 className="text-center mb-8">
          {/* <span className="block text-2xl mb-2">Welcome to the</span> */}
          <span className="block text-4xl font-bold">Directory</span>
        </h1>

        {namesList.length > 0 ? (
          <div className="overflow-x-auto w-full max-w-4xl">
            <table className="table w-full">
              <thead>
                <tr>
                  <th className="bg-primary text-primary-content">Wallet Name</th>
                  <th className="bg-primary text-primary-content">Address</th>
                </tr>
              </thead>
              <tbody>
                {namesList.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-base-200" : ""}>
                    <td>{item.name}</td>
                    <td className="font-mono">{item.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-lg">Loading names or no names found.</p>
        )}
      </div>
    </>
  );
};

export default DirectoryPage;
