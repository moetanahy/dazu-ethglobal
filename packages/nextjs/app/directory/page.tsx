import type { NextPage } from "next";

// import { MetaHeader } from "~~/components/MetaHeader";

const DirectoryPage: NextPage = () => {
  return (
    <>
      {/* <MetaHeader title="Directory" description="Directory page" /> */}
      <div className="flex items-center flex-col flex-grow pt-10">
        <h1 className="text-center mb-8">
          <span className="block text-2xl mb-2">Welcome to the</span>
          <span className="block text-4xl font-bold">Directory</span>
        </h1>
        <p className="text-center text-lg">This page is currently empty.</p>
      </div>
    </>
  );
};

export default DirectoryPage;
