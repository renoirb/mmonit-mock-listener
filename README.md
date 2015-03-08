# Monit collector mock listener

A *VERY* simple nodejs console logger of what Monit sends to collector.

Ever been curious about what Monit sends to the collector? This will help you dig into it.

This project is a simple mock listener to help understand what Monit sends,
if you want to collect data you might prefer to look to something already maintained such as [Python Diamond](https://github.com/python-diamond/Diamond)
or sponsor the author of Monit by purchasing a license to use [M/Monit](https://mmonit.com/shop/) that is a very fully fledged dashboard to manage in one place.

## Use

On a VM that has nodejs and npm installed, and this project cloned, do:

    npm install
    npm start
    // ... everything will happen in the stdout

Imagine that the internal IP address of where you run `npm start` is 10.10.10.232.

Now, in your Monit configuration, add the line:

    set mmonit http://10.10.10.232:8080

Reload Monit config

    sudo service monit restart

The nodejs runner should show lines similar to

```
Something happened { method: 'POST', ip: '10.10.10.169', type: 'text/xml' }
```

Thats’s it.
