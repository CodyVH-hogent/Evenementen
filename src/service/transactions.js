let { EVENTS } = require('../data/mock_data');



const getAllEvents = function(){
    return { items: EVENTS, count: EVENTS.length };
}

const getEventById = (id) => {
    //TODO
    if (EVENTS.find(e => e.id == id)){
      return EVENTS.find(e=>e.id == id)
    }

    // throw new Error('Not implemented yet!');
  };
  
const createEvent = ({ place, name, date, timeStart, timeEnd, description }) => {
  if(EVENTS.find(event => event.name == name)){
    // throw new Error("Dit event bestaat al.")
    console.log("Dit event bestaat al")
    return {}
  }
  const newEvent = {
    id:Math.max(...EVENTS.map(e => e.id))+1,
    place,
    name,
    date,
    timeStart,
    timeEnd,
    description,
  };
  EVENTS.push(newEvent)
  return newEvent
  //TODO er moeten nog checks gebeuren?
    
};
  
  const updateById = (id, { amount, date, placeId, user }) => {
    //TODO
    throw new Error('Not implemented yet!');
  };
  
  const deleteById = (id) => {
    //TODO
    throw new Error('Not implemented yet!');
  };


  module.exports = {
    getAll: getAllEvents,
    getById: getEventById,
    create: createEvent,
    updateById,
    deleteById,
  };