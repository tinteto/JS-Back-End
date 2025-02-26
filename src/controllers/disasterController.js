import { Router } from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import disasterService from "../services/disasterService.js";
import { getErrorMessage } from "../utils/errorUtils.js";


const disasterController = Router();


disasterController.get('/', async (req, res) => {
    const allDisasters = await disasterService.getAllDisasters();
    res.render('disasters/catalog', {disasters: allDisasters}); 
});



disasterController.get('/create', isAuth, (req, res) => {
    res.render('disasters/create');
});


disasterController.post('/create', isAuth, async (req, res) => {
    const disasterData = req.body;
    const userId = req.user.id;

    try {
        await disasterService.createDisaster(disasterData, userId);
        res.redirect('/disasters');
    } catch (err) {
        res.render('disasters/create', {error: getErrorMessage(err), disaster: disasterData, });   
    }
});


disasterController.get('/:disasterId/details', async (req, res) => {
const disasterId = req.params.disasterId;
const disaster = await disasterService.getOneDisaster(disasterId);

const isOwner = req.user && req.user.id === disaster.owner.toString();


  const isInterested = disaster.interestedList.includes(req.user?.id);

  res.render('disasters/details', { disaster, isOwner, isInterested });

});



//Get Edit
disasterController.get('/:disasterId/edit', isAuth, async (req, res) => {
 const disasterId = req.params.disasterId;
 const userId = req.user.id;

 const disaster = await disasterService.getOneDisaster(disasterId);

 const categories = getCategoriesData(disaster.category);

if(disaster.owner.toString() !== userId) {
    res.setError("Only owners are allowed to edit events!");
    return res.redirect(`/disasters/${disasterId}/details`);
}

res.render('disasters/edit', { disaster, categories });
});



//Post Edit
disasterController.post('/:disasterId/edit', isAuth, async (req, res) => {
const disasterId = req.params.disasterId;
const userId = req.user.id;
const disasterData = req.body;

try {
    await disasterService.editDisaster(disasterId, userId, disasterData);
    return res.redirect(`/disasters/${disasterId}/details`);
} catch (err) {
    const categories = getCategoriesData(disasterData.category);

    res.render('disasters/edit', {disaster: disasterData, categories,  error: getErrorMessage(err)})
}
});

// Delete
disasterController.get('/:disasterId/delete', isAuth, async (req, res) => {
    const disasterId = req.params.disasterId;
    const userId = req.user.id;

    try {
        await disasterService.deleteDisaster(disasterId, userId);
        res.redirect('/disasters');
    } catch (err) {
        res.setError(getErrorMessage(err));
        res.redirect(`/disasters/${disasterId}/details`);
    }
});


// Interested
disasterController.get('/:disasterId/interested', isAuth, async (req, res) => {
    const disasterId = req.params.disasterId;
    const userId = req.user.id;

    try {
        await disasterService.getInterestedInDisaster(disasterId, userId);

        res.redirect(`/disasters/${disasterId}/details`);
    } catch (err) {
     res.setError(getErrorMessage(err));
     res.redirect(`/disasters/${disasterId}/details`);
    }
});



// Select category
function getCategoriesData(category) {
    const categoriesMap = {
        'Wildfire': 'Wildfire',
        'Flood': 'Flood',
        'Earthquake': 'Earthquake',
        'Drought': 'Drought',
        'Tsunami': 'Tsunami',
        'Other': 'Other'
    };

    const categories = Object.keys(categoriesMap).map(value => ({
        value,
        label: categoriesMap[value],
        selected: value === category ? 'selected' : '',
    }))

    return categories;
}



export default disasterController;