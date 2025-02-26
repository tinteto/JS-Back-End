import Disaster from "../models/Disaster.js";

//Get All Disasters
export const getAllDisasters = () => {
    let allDisasters = Disaster.find({});
    return allDisasters;
};



//Get One Disaster
export const getOneDisaster = (disasterId) => {
    const oneDisaster = Disaster.findById(disasterId);
    return oneDisaster;
};



//Create Disaster
export const createDisaster = (disasterData, userId) => {
    const createdDisaster = Disaster.create({...disasterData, owner: userId});
    return createdDisaster;
};

//Edit Disaster
export const editDisaster = async (disasterId, userId, disasterData) => {
const disaster = await getOneDisaster(disasterId);

if(disaster.owner.toString() !== userId) {
    throw new Error("Only owners are allowed to edit events!");   
}

const editedDisaster = Disaster.findByIdAndUpdate(disasterId, disasterData, {runValidators: true})
return editedDisaster;
};


//Interested in disaster
export const getInterestedInDisaster = async (disasterId, userId) => {
const disaster = await Disaster.findById(disasterId);

if (disaster.owner.toString() === userId) {
    throw new Error("You are not allowed to get interested in this event!"); 
}

if (disaster.interestedList.includes(userId)) {
    throw new Error("You are already interested in this event!");
}

disaster.interestedList.push(userId);
return disaster.save();
};


//Delete Disaster
export const deleteDisaster = async (disasterId, userId) => {
    const disaster = await getOneDisaster(disasterId);

    if(disaster.owner.toString() !== userId) {
        throw new Error("Only owners are allowed to delete offers!");
        
    }

    const deletedDisaster = Disaster.findByIdAndDelete(disasterId);
    return deletedDisaster;
};



const disasterService = {
    createDisaster,
    getAllDisasters,
    getOneDisaster,
    getInterestedInDisaster,
    editDisaster,
    deleteDisaster,
}


export default disasterService;