# Northcoders House of Games API

## Required Files

Extra files will be need to successfully run the code.

**.env.development** - This file stores the name of the development database, it is used when seeding during development.

```
PGDATABASE=database_name_here
```

**.env.test** - This file stores the name of the test database, it is used when seeding during testing.

```
PGDATABASE=test_database_name_here
```

The database name in each file should match the corresponding database names in the `db/setup.sql` file.

## Setting Environment variables

The environment variables are set in the `db/connection.js` file. If the tests are being run, the enviroment will be set to test and the test database will be used, otherwise it will defautl to developement and the development database will be used.
