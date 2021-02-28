import {format} from '../src/lib/mountainProject';

const INPUT = {
  "Route": "Dark Horse",
  "Location": "Dark Horse Boulder > Guanella Pass > Georgetown > Colorado",
  "URL": "https://www.mountainproject.com/route/117068715/dark-horse",
  "Avg Stars": "3.9",
  "Your Stars": "-1",
  "Route Type": "Boulder, Alpine",
  "Rating": "V10",
  "Pitches": "1",
  "Length": "20",
  "Area Latitude": "39.66455",
  "Area Longitude": "-105.70464",
  "id": "117068715",
  "type": "boulder",
  "name": "Dark Horse",
  "ticks": [
    {
      "name": "Ryne Silver",
      "date": "Nov 3, 2020"
    },
    {
      "name": "Alex Johnson",
      "date": "Sep 25, 2020",
      "comment": "·  Solo."
    },
    {
      "name": "Karl Johnson",
      "date": "Sep 25, 2020",
      "comment": "·  Send."
    },
    {
      "name": "Tank Evans",
      "date": "Sep 21, 2020"
    },
    {
      "name": "Armen9252",
      "date": "Sep 20, 2020",
      "comment": "·  Send."
    },
    {
      "name": "Jesse Tatum",
      "date": "Sep 19, 2020",
      "comment": "·  Send. One session, 6 or so attempts."
    },
    {
      "name": "Enrico Gutierrez",
      "date": "Sep 15, 2020"
    },
    {
      "name": "Will Lewis",
      "date": "Sep 2, 2020",
      "comment": "·  Attempt. Soooo damn close! Next time!"
    },
    {
      "name": "Colin Meyer",
      "date": "Jul 6, 2020",
      "comment": "·  Solo."
    },
    {
      "name": "Tanner Bauer",
      "date": "Jun 6, 2020",
      "comment": "·  Lead / Flash."
    },
    {
      "name": "Mason Caiby",
      "date": "Nov 3, 2019",
      "comment": "·  Lead."
    },
    {
      "name": "Kyle Wagner",
      "date": "Oct 18, 2019",
      "comment": "·  Send."
    },
    {
      "name": "Robert Daniel",
      "date": "Aug 17, 2019",
      "comment": "·  Send. Send in a day w Fidi and Morgan"
    },
    {
      "name": "Jack McNamara",
      "date": "Jul 27, 2019"
    },
    {
      "name": "Isaac Trujillo",
      "date": "Jul 26, 2019",
      "comment": "·  Solo."
    },
    {
      "name": "Dave L",
      "date": "Jun 8, 2019",
      "comment": "·  Send. 1 day."
    },
    {
      "name": "Nickolas Gagliardi",
      "date": "May 31, 2019"
    },
    {
      "name": "Oliver Nix",
      "date": "May 25, 2019"
    },
    {
      "name": "suffrage",
      "date": "May 25, 2019",
      "comment": "·  Send."
    },
    {
      "name": "Dave Lee",
      "date": "Dec 31, 2018",
      "comment": "·  Send."
    },
    {
      "name": "Joseph Cassidy",
      "date": "Sep 26, 2018"
    },
    {
      "name": "Greg Varela",
      "date": "Jul 28, 2018",
      "comment": "·  Send."
    },
    {
      "name": "John Chipouras",
      "date": "Nov 14, 2017"
    },
    {
      "name": "Andrew Zaslove",
      "date": "Apr 15, 2017",
      "comment": "·  Send."
    },
    {
      "name": "Pat Brehm",
      "date": "Sep 23, 2016"
    }
  ],
  "suggestedRatings": [
    {
      "name": "Dave Lee",
      "grade": "V10"
    },
    {
      "name": "Ryne Silver",
      "grade": "V10"
    },
    {
      "name": "Joseph Cassidy",
      "grade": "V10"
    },
    {
      "name": "Armen9252",
      "grade": "V10"
    },
    {
      "name": "Jesse Tatum",
      "grade": "V10"
    },
    {
      "name": "Enrico Gutierrez",
      "grade": "V10"
    },
    {
      "name": "Nickolas Gagliardi",
      "grade": "V10 PG13"
    },
    {
      "name": "Colin Meyer",
      "grade": "V10"
    },
    {
      "name": "Greg Varela",
      "grade": "V10"
    },
    {
      "name": "John Chipouras",
      "grade": "V10"
    },
    {
      "name": "Karl Johnson",
      "grade": "V10-"
    },
    {
      "name": "Alex Johnson",
      "grade": "V9"
    },
    {
      "name": "Tanner Bauer",
      "grade": "V9"
    },
    {
      "name": "Chris Deuto",
      "grade": "V9"
    }
  ],
  "starRatings": [
    {
      "name": "Dave Lee",
      "stars": 4
    },
    {
      "name": "Alex Johnson",
      "stars": 4
    },
    {
      "name": "John Chipouras",
      "stars": 4
    },
    {
      "name": "Ryne Silver",
      "stars": 4
    },
    {
      "name": "Joseph Cassidy",
      "stars": 4
    },
    {
      "name": "Armen9252",
      "stars": 4
    },
    {
      "name": "Karl Johnson",
      "stars": 4
    },
    {
      "name": "Jesse Tatum",
      "stars": 4
    },
    {
      "name": "Tank Evans",
      "stars": 4
    },
    {
      "name": "Enrico Gutierrez",
      "stars": 4
    },
    {
      "name": "Nickolas Gagliardi",
      "stars": 4
    },
    {
      "name": "Tanner Bauer",
      "stars": 4
    },
    {
      "name": "Chris Deuto",
      "stars": 4
    },
    {
      "name": "Kyle Wagner",
      "stars": 4
    },
    {
      "name": "Mason Caiby",
      "stars": 4
    },
    {
      "name": "Robert Daniel",
      "stars": 4
    },
    {
      "name": "Greg Varela",
      "stars": 4
    },
    {
      "name": "suffrage",
      "stars": 4
    },
    {
      "name": "Colin Meyer",
      "stars": 4
    }
  ]
};

(async function() {
  const result = format(INPUT);
  console.log(JSON.stringify(result, null, 2));
})()