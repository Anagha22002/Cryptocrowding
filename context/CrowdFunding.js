import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
// INTERNAL IMPORT
import { CrowdFundingABI, CrowdFundingAddress } from "./constants";

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = "Crowd Funding Contract";
  const [currentAccount, setCurrentAccount] = useState("");


  const createCampaign = async (campaign) => {
    const { title, description, amount, deadline } = campaign;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signer);
    console.log("current account is" + currentAccount);
    try {
      const transaction = await contract.createCampaign(
        currentAccount, // owner
        title, // title
        description, // description
        ethers.utils.parseUnits(amount, 18),
        new Date(deadline).getTime() // deadline
      );
      await transaction.wait();
      console.log("contract call success", transaction);
      
      // Retrieve deployer address from the contract
      const deployer = await getDeployerAddress();
      setDeployerAddress(deployer);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const contract = new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, provider);
    const campaigns = await contract.getCampaigns();
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      pId: i,
    }));
    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const contract = new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, provider);
    const allCampaigns = await contract.getCampaigns();

    const accounts = await window.ethereum.request({
      method: "eth_accounts"
    });
    const currentUser = accounts[0];
    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === currentUser
    );
    const userData = filteredCampaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pId: i,
    }));
    return userData;
  };

  const donate = async (pId, amount) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signer);
    const campaignData = await contract.donateToCampaign(pId, {
      value: ethers.utils.parseEther(amount),
    });

    await campaignData.wait();
    location.reload();

    return campaignData;
  };

  const getDonations = async (pId) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const contract = new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, provider);

    const donations = await contract.getDonators(pId);
    const numberOfDonations = donations[0].length;
    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }
    return parsedDonations;
  };

  // ---CHECK IF WALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install Metamask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length){
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No Account Found");
      }
    } catch(error) {
      console.log("Something went wrong while connecting to wallet");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        console.error("MetaMask is not installed.");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("Error while connecting to the wallet:", error);
    }
  };

  useEffect(() => {
    // Fetch deployer address when component mounts
    const fetchDeployerAddress = async () => {
      try {
        const deployer = await getDeployerAddress();
        setDeployerAddress(deployer);
        console.log(deployer);
      } catch (error) {
        console.error("Error fetching deployer address:", error);
      }
    };

    fetchDeployerAddress();
  }, []);

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        createCampaign,
        getCampaigns,
        connectWallet,
        donate,
        getUserCampaigns,
        getDonations,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
