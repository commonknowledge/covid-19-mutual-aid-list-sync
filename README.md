# covid-19-mutual-aid-list-sync

Syncs the different lists of UK based COVID-19 Mutual Aid groups.

## Lists

There are currently three lists of UK based COVID-19 Mutual Aid groups.

- [https://freedomnews.org.uk/covid-19-uk-mutual-aid-groups-a-list/](https://freedomnews.org.uk/covid-19-uk-mutual-aid-groups-a-list/) maintained by [Freedom](https://freedomnews.org.uk/)
- [https://docs.google.com/spreadsheets/d/18P898HWbdR5ouW61sAxW_iBl3yiZlgJu0nSmepn6NwM/edit] Google Spreadsheet maintained by [Covid-19 Mutual Aid - UK](https://www.facebook.com/CovidAidUK/)
- [https://airtable.com/shrNbWr103SAkI7kX/tblFqGvhbICXwl493] maintained by us at [Common Knowledge](https://commonknowledge.coop/)

This software will keep all of them in sync with one another.

## Syncs

`missing-groups-in-national-list.js`

This syncs the Covid-19 Mutual Aid - UK spreadsheet with the Common Knowledge Airtable.

The Airtable was manually updated to ensure everything in the Covid-19 Mutual Aid - UK spreadsheet is in the Airtable.

After this sync point, the Covid-19 Mutual Aid - UK spreadsheet is canonical and the source of truth.

We have shut the Airtable input form down, with a soft direct to the form to add to the spreadsheet.

`freedom-to-airtable.js`

This soft-syncs the Freedom list with the Common Knowledge Airtable in both directions

- It finds what is missing from the Freedom list and updates Airtable to mark those which are. Freedom staff can then see a view of this via Airtable and update the list once they've verified the groups.
- It finds everything on the Freedom list but not in the Airtable. As these are often fewer, and the Covid-19 Mutual Aid - UK spreadsheet is canonical, these are printed out in order to be written back manually.
