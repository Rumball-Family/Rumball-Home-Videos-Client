const express = require('express');
const hbs = require('hbs');
var axios = require('axios');

var app = express();

const SERVER_PORT = process.env.PORT || 3002;

hbs.registerPartials(__dirname + '/views/partials');
app.use('/public', express.static(__dirname + '/public'));
app.set('view engine', 'hbs');

var serverURL = 'https://rumball-home-videos.herokuapp.com/clips';

var familyNamesKey = {
    'Kenneth Rumball': 'Papa',
    'Catherine Rumball': 'Grandma',
    'John Rumball': 'John',
    'Valerie Rumball': 'Valerie',
    'Colin Rumball': 'Colin',
    'Kelsey Rumball': 'Kelsey',
    'Rick Lean': 'Rick',
    'Lauralyn Lean': 'Lauralyn',
    'Alicia Lean': 'Alicia',
    'Olivia Lean': 'Olivia',
    'David Rumball': 'Dave',
    'Kimberley Rumball': 'Kim'
};

var tagsKey = {
    'Cute': 'Cute',
    'Funny': 'Funny',
    'Heart Warming': 'Heartwarming',
    'Holidays': 'Holidays',
    'Birthdays': 'Birthdays',
    'Sports and Activities': 'Sports'
};

app.get('/', (req, res) => {
    axios.get(serverURL, { headers: { 'Content-Type': 'application/json' } } ).then((jsonClips) => {
        var clips = createClipsObject(jsonClips.data.clips);
        res.render('page.hbs', {clips});
    }).catch((e) => {
        res.render('page.hbs', {undefined});
    });
});

app.get('/clips/:queries', (req, res) => {
    var queries = req.params.queries;
    axios.get(serverURL+'/'+queries, { headers: { 'Content-Type': 'application/json' } } ).then((jsonClips) => {
        var clips = createClipsObject(jsonClips.data.clips);
        res.send({clips});
    }).catch((e) => {

    });
});

app.listen(SERVER_PORT, () => {
    console.log('Server started on port:', SERVER_PORT);
});

var clipSort_year = function(a, b) {
    return a.year - b.year;
};

var createClipsObject = function(clips) {
    if (clips.length > 30)
    {
        clips = clips.slice(0, 30);
    }

    clips.sort(clipSort_year);

    clips.forEach(function(clip) {
        for (var i = 0; i < clip.familyMembers.length; i++)
        {
            clip.familyMembers[i] = ' ' + familyNamesKey[clip.familyMembers[i]];
        }

        for (var j = 0; j < clip.tags.length; j++)
        {
            clip.tags[j] = ' ' + tagsKey[clip.tags[j]];
        }
    });

    return clips;
};