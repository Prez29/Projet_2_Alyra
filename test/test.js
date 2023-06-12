const Voting = artifacts.require("Voting");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require('chai');

contract("Voting", (accounts) => {
  const [owner, voter_1, voter_2] = accounts;
  const proposal_1 = "proposal_1"
  const proposal_2 = "proposal_2"

  let votingInstance;


  beforeEach(async () => {
    votingInstance = await Voting.new({ from: owner });
  });

  describe("getVoter", () => {//corrigé car ce describe ne fonctionnait pas
    it("should get a voter", async () => {
      const voter = voter_1;
      await votingInstance.addVoter(voter, {from: owner});
      const receipt = await votingInstance.getVoter(voter, {from: voter_1});
      expect(receipt.isRegistered).to.be.true;
      expect(receipt.hasVoted).to.be.false;
      expect(receipt.votedProposalId).to.be.bignumber.equal(new BN(0));
    });

    it("should check voter is registered", async () => {
      const voter = voter_1;
      await votingInstance.addVoter(voter, {from: owner});
      const receipt = await votingInstance.getVoter(voter, {from: voter_1});
      const result = await votingInstance.getVoter(voter, {from: voter_1});
      const isRegistered = result.isRegistered;
      expect(isRegistered).to.be.true;
    });
  });

  describe("getOneProposal", () => {
    it("should get a proposal", async () => {
      const voter = voter_1;
      const proposal = proposal_1;
      await votingInstance.addVoter(voter, {from: owner});
      await votingInstance.startProposalsRegistering({from: owner});
      await votingInstance.addProposal(proposal, {from: voter_1});
      const receipt = await votingInstance.getOneProposal(1, {from: voter_1});
      expect(receipt.description).to.equal(proposal_1);
    });
  });


  describe("addVoter", () => {

    it("should add a voter", async () => {
      const voter = voter_1;
      const receipt = await votingInstance.addVoter(voter, {from: owner});
      const result = await votingInstance.getVoter(voter, {from: voter_1});
      expect(result.isRegistered).to.be.true;
      expectEvent(receipt, "VoterRegistered", {voterAddress: voter_1});
    });

    it("should check voter has not voted", async () => {
      const voter = voter_1;
      await votingInstance.addVoter(voter, {from: owner});
      const receipt = await votingInstance.getVoter(voter, {from: voter_1});
      expect(receipt.hasVoted).to.be.false;
    });

      it("should check votedProposalId = 0", async () => {
        const voter = voter_1;
        await votingInstance.addVoter(voter, {from: owner});
        const receipt = await votingInstance.getVoter(voter, {from: voter_1});
        expect(receipt.votedProposalId).to.be.bignumber.equal(new BN(0));

    });

    it("should check proposal is registered", async () => {
      const voter = voter_1;
      await votingInstance.addVoter(voter, {from: owner});
      await votingInstance.startProposalsRegistering({from: owner});
      await votingInstance.addProposal(proposal_1, {from: voter_1});
      const receipt = await votingInstance.getOneProposal(1, {from: voter_1});
      expect(receipt.description).to.equal(proposal_1);
    });
  });


  describe("addProposal", () => {
    beforeEach(async () => {
      await votingInstance.addVoter(voter_1, {from: owner});
      await votingInstance.addVoter(voter_2, {from: owner});
      await votingInstance.startProposalsRegistering({from: owner});
    });

    it("should add a proposal", async () => {
      const receipt = await votingInstance.addProposal(proposal_1, {from: voter_1});
      const result = await votingInstance.getOneProposal(1, {from: voter_1});
      expect(result.description).to.equal(proposal_1);
      expectEvent(receipt, "ProposalRegistered", {proposalId: new BN(1)});
    });

    it("should check proposal is registered", async () => {
      const receipt = await votingInstance.addProposal(proposal_1, {from: voter_1});
      const result = await votingInstance.getOneProposal(1, {from: voter_1});
      expect(result.description).to.equal(proposal_1);
    });

    it("should check proposal is not registered", async () => {
      await votingInstance.addProposal(proposal_1, {from: voter_1});
      await expect(votingInstance.addProposal(proposal_1, {from: voter_1}), "This proposal is already registered");
    });

    it("should revert when voting by unregistered voter", async () => {
      const unregisteredVoter = accounts[3];
      await expectRevert(votingInstance.setVote(0, { from: unregisteredVoter }),"You're not a voter");
    });
  });

  describe("setVote", () => {
    beforeEach(async () => {
      const voter = voter_1;
      const proposal = proposal_1;
      await votingInstance.addVoter(voter_1, {from: owner});
      await votingInstance.addVoter(voter_2, {from: owner});
      await votingInstance.startProposalsRegistering({from: owner});
      await votingInstance.addProposal(proposal_1, {from: voter_1});
      await votingInstance.addProposal(proposal_2, {from: voter_2});
      await votingInstance.endProposalsRegistering({from: owner});
      await votingInstance.startVotingSession({from: owner});
    });

    it("should vote", async () => {
      const receipt = await votingInstance.setVote(1, {from: voter_1});
      const result = await votingInstance.getVoter(voter_1, {from: voter_1});
      expect(result.hasVoted).to.be.true;
      expectEvent(receipt, "Voted", {voter: voter_1, proposalId: new BN(1)});
    });

    it("should vote successfully", async () => {
      const receipt = await votingInstance.setVote(1, {from: voter_1});
      const result = await votingInstance.getVoter(voter_1, {from: voter_1});
      expect(result.hasVoted).to.be.true;
      expectEvent(receipt, "Voted", {voter: voter_1, proposalId: new BN(1)});
    });
  
    it("should revert when voter is not registered", async () => {
      const unregisteredVoter = accounts[3];
      await expectRevert(votingInstance.setVote(0, { from: unregisteredVoter }),"You're not a voter");
    });

    it("should revert when voter has already voted", async () => {
      const voter = voter_1;
      await votingInstance.setVote(0, { from: voter });
      await expectRevert(votingInstance.setVote(0, { from: voter }),"You have already voted");
    });
  
    it("should revert when proposal ID is invalid", async () => {
      const invalidProposalId = 3;     
      await expectRevert(votingInstance.setVote(invalidProposalId, { from: voter_1 }), "Proposal not found");
    });
  });

    describe("WorkflowStatus", () => {
      it("should be in RegisteringVoters state", async () => {
      const state = await votingInstance.workflowStatus({ from: owner });
      expect(state).to.be.bignumber.equal(new BN(0));
    });
  
      it("should be in startProposalsRegistering state", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      const state = await votingInstance.workflowStatus({ from: owner });
      expect(state).to.be.bignumber.equal(new BN(1));
    });

      it("should be in endProposalsRegistering state", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.endProposalsRegistering({ from: owner });
      const state = await votingInstance.workflowStatus({ from: owner });
      expect(state).to.be.bignumber.equal(new BN(2));
    });

      it("should be in startVotingSession state", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.endProposalsRegistering({ from: owner });

      await votingInstance.startVotingSession({ from: owner });
      const state = await votingInstance.workflowStatus({ from: owner });
      expect(state).to.be.bignumber.equal(new BN(3));
    });  

      it("should be in endVotingSession state", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });
      await votingInstance.endVotingSession({ from: owner });
      const state = await votingInstance.workflowStatus({ from: owner });
      expect(state).to.be.bignumber.equal(new BN(4));
    }); 
    
      it("should be in tallyVotes state", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });
      await votingInstance.endVotingSession({ from: owner });
      await votingInstance.tallyVotes({ from: owner });
      const state = await votingInstance.workflowStatus({ from: owner });
      expect(state).to.be.bignumber.equal(new BN(5));
    });
  });
})
