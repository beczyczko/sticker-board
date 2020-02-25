const StickersRepo = {
    get: get,
    remove: remove
};

function get() {
    return [
        {
            id: '1',
            text: 'long text try to wrap it with pretty way',
            x: 100,
            y: 40,
        },
        {
            id: '2',
            text: 'funny little sticker',
            x: 350,
            y: 880,
        },
        {
            id: '3',
            text: 'long German word rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz',
            x: 450,
            y: 220,
        },
    ]
}

function remove(sticker) {
    console.log('remove: ', sticker);
}

export default StickersRepo;
