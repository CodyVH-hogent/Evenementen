let EVENTS = [
    {
        id: 1,
        place: 'Coffee Haven',
        name: 'Morning Brew Meetup',
        date: '2023-11-15',
        timeStart: '09:00 AM',
        timeEnd: '11:00 AM',
        description: 'Join us for a casual morning coffee meetup!',
        // attendees: ['Xander', 'Cody']
    },
    {
        id: 2,
        place: 'Tech Hub',
        name: 'Tech Talk Tuesday',
        date: '2023-11-20',
        timeStart: '06:30 PM',
        timeEnd: '08:00 PM',
        description: 'An evening of tech discussions and networking.',
        // attendees: ['Zed', 'Lars']
    },
    {
        id: 3,
        place: 'Art Studio',
        name: 'Creative Workshop',
        date: '2023-12-02',
        timeStart: '02:00 PM',
        timeEnd: '04:30 PM',
        description: 'Explore your artistic side in this hands-on workshop.',
        // attendees: ['Noah', 'Elias']
    },
];

let TICKETS = [
    {
        id: 1,
        eventName: "Tech Talk Tuesday",
        place: 'Tech Hub',
        purchaseDate: "2023-01-09",
    },
    {
        id: 2,
        eventName: "Creative Workshop",
        place: 'Art Studio',
        purchaseDate: "2023-01-09",
    },
    {
        id: 3,
        eventName: "Morning Brew Meetup",
        place: 'Coffee Haven',
        purchaseDate: "2023-01-09",
    },
]
let PERSON = [
    {
        id: 1,
        firstName: "Xander",
        lastName: 'Danckmemes'
    },
    {
        id: 2,
        firstName: "Cody",
        lastName: 'VH'
    },
    {
        id: 3,
        firstName: "Eliasje",
        lastName: 'csoregh'
    },
]

let PLACE = [
    {
        id: 1,
        street: "Een straat + een nummer",
        postalCode: "6969",
        province: "Een provincie",
        country: "Een land"
    },
    {
        id: 2,
        street: "straatje + getalletje",
        postalCode: "1001",
        province: "provincietje",
        country: "landje"
    },
    {
        id: 3,
        street: "Straaaaaat + nummeeeeer",
        postalCode: "33333333333333333",
        province: "Provincieeeee",
        country: "Laaaaaaaand"
    }
];
module.exports = {
    EVENTS,
    TICKETS,
    PERSON,
    PLACE
}
