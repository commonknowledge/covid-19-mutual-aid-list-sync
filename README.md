# covid-19-mutual-aid-list-sync

Syncs the different lists of UK based COVID-19 Mutual Aid groups. Not especially clever but does the job.

## Lists

There are currently three lists of UK based COVID-19 Mutual Aid groups.

- [A flat HTML list](https://freedomnews.org.uk/covid-19-uk-mutual-aid-groups-a-list/) maintained by [Freedom](https://freedomnews.org.uk/)
- [Google Spreadsheet](https://docs.google.com/spreadsheets/d/18P898HWbdR5ouW61sAxW_iBl3yiZlgJu0nSmepn6NwM/edit) maintained by [Covid-19 Mutual Aid - UK](https://www.facebook.com/CovidAidUK/) - [there is CSV version](https://docs.google.com/spreadsheets/d/e/2PACX-1vTvSFFG0ByJlzWLBVZ_-sYdhGLvMCCrbb_Fe9sA9LZ_Y_BFoq1BVEFGLf4t--pJ8gg73o0ULvqYlqdk/pub?gid=1451634215&single=true&output=csv)
- [https://airtable.com/shrNbWr103SAkI7kX/tblFqGvhbICXwl493](https://airtable.com/shrNbWr103SAkI7kX/tblFqGvhbICXwl493) maintained by us at [Common Knowledge](https://commonknowledge.coop/) which we have deprecated in favour of the Covid-19 Mutual Aid - UK spreadsheet.

This software will keep all of them in sync with one another.

We deprecated our list, but as the link is still out there need to make sure it is kept up to date.

## Syncs

### `missing-groups-in-national-list.js`

This syncs the Covid-19 Mutual Aid - UK spreadsheet with the Common Knowledge Airtable. We have deprecated this Airtable, but as it is still being shared, we are going to keep it up to date.

The Airtable was manually updated to ensure everything in the spreadsheet is in the Airtable. After this sync point, the spreadsheet is canonical and the source of truth.

We have shut the Airtable input form down, with a soft redirect to the form to add to the spreadsheet.

### `freedom-to-airtable.js`

This soft-syncs the Freedom list with the Common Knowledge Airtable in both directions

- It finds what is missing from the Freedom list and updates Airtable to mark those which are. Freedom staff can then see a view of this via Airtable and update the list once they've verified the groups.
- It finds everything on the Freedom list but not in the Airtable. As the spreadsheet is canonical, these are printed out in order to be written back manually.

### Persistantly Running Syncs

You run these on a simple shell loop.

For example:

```
while true; do node missing-groups-in-national-list.js; echo "Waiting two minutes..."; echo; sleep 120; done
```

## Development

### Running Tests

`jest test`

### Development Footguns

This uses the [functional version of Lodash](https://github.com/lodash/lodash/wiki/FP-Guide).

This is to make dealing with long lists and composing functions dealing with lists a little easier.

Instead of this:

```js
// Instead of this
_.filter([1, 2, 3], () => x > 2);

// This
_.filter(() => x > 2, [1, 2, 3]);

// Or this

// Creates a function to do this when given a list
const filterGreaterThan2 = _.filter(x => x > 2);

// Uses it
const numbersGreaterThan2 = filterGreaterThan2([1, 2, 3]);
```

## License

This code is licensed under the [GNU Affero General Public License](LICENSE).

This is similar the the General Public License but with the addition that if you are [running the code on a server you must distribute the source code](https://www.gnu.org/licenses/why-affero-gpl.html).

Please respect this license. We feel it best reflects the open sharing needed to respond to this crisis. Any modification of this code that is running on a server must be open sourced.
