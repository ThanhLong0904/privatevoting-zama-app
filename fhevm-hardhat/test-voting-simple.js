const { ethers } = require("hardhat");

async function testSimpleVoting() {
  const [deployer, voter1, voter2] = await ethers.getSigners();

  console.log("Testing VotingRoom contract with voteSimple function...");
  console.log("Contract address:", "0xB32521a5BC535749Da8EF02a325C1CD844BD9575");

  // Get the deployed contract
  const VotingRoom = await ethers.getContractFactory("VotingRoom");
  const votingRoom = VotingRoom.attach("0xB32521a5BC535749Da8EF02a325C1CD844BD9575");

  console.log("Connected to VotingRoom contract");

  // Test creating a room
  const roomCode = "TEST" + Date.now();
  const title = "Test Room";
  const description = "Testing simple voting";
  const maxParticipants = 10;
  const endTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

  console.log("Creating room with code:", roomCode);

  try {
    const tx = await votingRoom.createRoom(
      roomCode,
      title,
      description,
      maxParticipants,
      endTime,
      false, // no password
      ethers.ZeroHash
    );
    await tx.wait();
    console.log("✅ Room created successfully");

    // Add candidates
    console.log("Adding candidates...");

    const addCandidateTx = await votingRoom.addCandidate(
      roomCode,
      "Candidate A",
      "First candidate",
      ""
    );
    await addCandidateTx.wait();
    console.log("✅ Candidate A added");

    const addCandidate2Tx = await votingRoom.addCandidate(
      roomCode,
      "Candidate B",
      "Second candidate",
      ""
    );
    await addCandidate2Tx.wait();
    console.log("✅ Candidate B added");

    // Test voting with the simple function
    console.log("Testing voteSimple function...");

    const voteTx = await votingRoom.connect(deployer).voteSimple(roomCode, 0);
    await voteTx.wait();
    console.log("✅ Vote cast successfully with voteSimple!");

    console.log("Test completed successfully - no 0xbf18af43 error!");

  } catch (error) {
    console.error("❌ Test failed:", error);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

testSimpleVoting()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });