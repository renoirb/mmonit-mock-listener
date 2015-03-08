# Monit collector mock listener

A *VERY* simple nodejs console logger of what Monit sends to collector.

Ever been curious about what Monit sends to the collector? This will help you dig into it.

This small repo is a simple mock listener to help understand what Monit sends.

In fact, this simply dumps to STDOUT a JSON representation of what anything could send an XML content through HTTP POST to an endpoint.

This utility might be useful if you want to reverse-engineer what Monit sends to [M/Monit](https://mmonit.com/shop/) collector.

The author of this project has no ties with the Monit project strongly recommend to use [M/Monit](https://mmonit.com/shop/) if you appreciate the value of monit.

If you want to gather metrics Monit sends, an alternative could be to use [Python Diamond](https://github.com/python-diamond/Diamond) as a collector,
and [Mozilla Heka](https://github.com/mozilla-services/heka) as a way to relay metrics to get graphs.


# Use

On a VM that has nodejs and npm installed, and this project cloned, do:

    npm install
    npm start
    // ... everything will happen in the stdout

Imagine that the internal IP address of where you run `npm start` is 10.10.10.232.

Now, in your Monit configuration, add the line:

    set mmonit http://10.10.10.232:8080/collector

Along with similar config loaded in Monit:

Reload Monit;

    sudo service monit restart

After some time, the nodejs runner should show when monit send updates, and display a JSON representation of the posted XML body:

```
Something happened { method: 'POST', ip: '10.10.10.169', type: 'text/xml' }
{
  '$':
   { id: '...',
     incarnation: '...',
     version: '5.6' },
  server: [ {} ],
  platform: [ {} ],
  services: [ {} ],
  servicegroups: [ {} ],
  event: [ {} ]
}
```

Thats’s it.


# Sample Monit configuration and output

### Monit configuration

The output you’ll see in [Sample output](#Sample output) was based on the following Monit configuration.

```
check system salt.staging.wpdn
  if loadavg (1min) > 4 then alert
  if loadavg (5min) > 2 then alert
  if memory usage > 85% then alert
  if swap usage > 25% then alert
  if cpu usage (user) > 70% then alert
  if cpu usage (system) > 30% then alert
  if cpu usage (wait) > 20% then alert

check process openssh-server
  with pidfile "/var/run/sshd.pid"
  group essentials
  start = "/usr/sbin/service ssh start"
  stop  = "/usr/sbin/service ssh stop"
  if not exist for 3 cycles then restart
  if 5 restarts within 5 cycles then timeout

check process salt-minion
  with pidfile "/var/run/salt-minion.pid"
  group essentials
  start = "/usr/sbin/service salt-minion start"
  stop  = "/usr/sbin/service salt-minion stop"
  if not exist for 3 cycles then restart
  if 5 restarts within 5 cycles then timeout

set httpd port 2812 signature disable and
  allow localhost
  allow foooooo:baaaaaar
  allow @admin
  allow @users readonly

check process gdnsd
  with pidfile "/var/run/gdnsd/gdnsd.pid"
  start = "/usr/sbin/service gdnsd start"
  stop  = "/usr/sbin/service gdnsd stop"
  if failed port 53 protocol DNS then restart
  if not exist for 3 cycles then restart
  if 5 restarts within 5 cycles then timeout
  if 3 restarts within 5 cycles then alert

check process syslog-ng
  with pidfile "/var/run/syslog-ng.pid"
  group logging
  start = "/usr/sbin/service syslog-ng start"
  stop  = "/usr/sbin/service syslog-ng stop"
  if not exist for 3 cycles then restart
  if 5 restarts within 5 cycles then timeout

check process salt-master
  with pidfile "/var/run/salt-master.pid"
  group salt
  start = "/usr/sbin/service salt-master start"
  stop  = "/usr/sbin/service salt-master stop"
  if not exist for 3 cycles then restart
  if 3 restarts within 5 cycles then alert
  if 5 restarts within 5 cycles then timeout

check process exim4
  with pidfile "/var/run/exim4/exim.pid"
  group mail
  start = "/usr/sbin/service exim4 start"
  stop  = "/usr/sbin/service exim4 stop"
  if failed port 25 protocol SMTP with timeout 10 seconds and retry 2 times then restart
  if not exist for 3 cycles then restart
  if 3 restarts within 5 cycles then alert
  if 5 restarts within 5 cycles then timeout


  set mmonit http://10.10.10.232:8080/collector
```

### Sample output


```
Something happened { method: 'POST', ip: '10.10.10.169', type: 'text/xml' }
```
Then followed by a big JSON object:
```javascript
{
    "$": {
        "id": "7cbd97795c5cb2fc88be411a9b5034e4",
        "incarnation": "1425792488",
        "version": "5.6"
    },
    "server": [
        {
            "uptime": [
                "40008"
            ],
            "poll": [
                "120"
            ],
            "startdelay": [
                "0"
            ],
            "localhostname": [
                "salt.staging.wpdn"
            ],
            "controlfile": [
                "/etc/monit/monitrc"
            ],
            "httpd": [
                {
                    "address": [
                        "10.10.10.169"
                    ],
                    "port": [
                        "2812"
                    ],
                    "ssl": [
                        "0"
                    ]
                }
            ],
            "credentials": [
                {
                    "username": [
                        "foooooo"
                    ],
                    "password": [
                        "baaaaaar"
                    ]
                }
            ]
        }
    ],
    "platform": [
        {
            "name": [
                "Linux"
            ],
            "release": [
                "3.13.0-46-generic"
            ],
            "version": [
                "#77-Ubuntu SMP Mon Mar 2 18:23:39 UTC 2015"
            ],
            "machine": [
                "x86_64"
            ],
            "cpu": [
                "2"
            ],
            "memory": [
                "4048276"
            ],
            "swap": [
                "0"
            ]
        }
    ],
    "services": [
        {
            "service": [
                {
                    "$": {
                        "name": "syslog-ng"
                    },
                    "type": [
                        "3"
                    ],
                    "collected_sec": [
                        "1425832378"
                    ],
                    "collected_usec": [
                        "342282"
                    ],
                    "status": [
                        "0"
                    ],
                    "status_hint": [
                        "0"
                    ],
                    "monitor": [
                        "1"
                    ],
                    "monitormode": [
                        "0"
                    ],
                    "pendingaction": [
                        "0"
                    ],
                    "pid": [
                        "1012"
                    ],
                    "ppid": [
                        "1011"
                    ],
                    "uptime": [
                        "149684"
                    ],
                    "children": [
                        "0"
                    ],
                    "memory": [
                        {
                            "percent": [
                                "0.1"
                            ],
                            "percenttotal": [
                                "0.1"
                            ],
                            "kilobyte": [
                                "5180"
                            ],
                            "kilobytetotal": [
                                "5180"
                            ]
                        }
                    ],
                    "cpu": [
                        {
                            "percent": [
                                "0.0"
                            ],
                            "percenttotal": [
                                "0.0"
                            ]
                        }
                    ]
                },
                {
                    "$": {
                        "name": "salt-master"
                    },
                    "type": [
                        "3"
                    ],
                    "collected_sec": [
                        "1425832378"
                    ],
                    "collected_usec": [
                        "342317"
                    ],
                    "status": [
                        "0"
                    ],
                    "status_hint": [
                        "0"
                    ],
                    "monitor": [
                        "1"
                    ],
                    "monitormode": [
                        "0"
                    ],
                    "pendingaction": [
                        "0"
                    ],
                    "pid": [
                        "938"
                    ],
                    "ppid": [
                        "1"
                    ],
                    "uptime": [
                        "149684"
                    ],
                    "children": [
                        "11"
                    ],
                    "memory": [
                        {
                            "percent": [
                                "1.3"
                            ],
                            "percenttotal": [
                                "17.5"
                            ],
                            "kilobyte": [
                                "55420"
                            ],
                            "kilobytetotal": [
                                "712036"
                            ]
                        }
                    ],
                    "cpu": [
                        {
                            "percent": [
                                "0.0"
                            ],
                            "percenttotal": [
                                "1.5"
                            ]
                        }
                    ]
                },
                {
                    "$": {
                        "name": "exim4"
                    },
                    "type": [
                        "3"
                    ],
                    "collected_sec": [
                        "1425832378"
                    ],
                    "collected_usec": [
                        "352500"
                    ],
                    "status": [
                        "0"
                    ],
                    "status_hint": [
                        "0"
                    ],
                    "monitor": [
                        "1"
                    ],
                    "monitormode": [
                        "0"
                    ],
                    "pendingaction": [
                        "0"
                    ],
                    "pid": [
                        "25311"
                    ],
                    "ppid": [
                        "1"
                    ],
                    "uptime": [
                        "18881"
                    ],
                    "children": [
                        "0"
                    ],
                    "memory": [
                        {
                            "percent": [
                                "0.0"
                            ],
                            "percenttotal": [
                                "0.0"
                            ],
                            "kilobyte": [
                                "1112"
                            ],
                            "kilobytetotal": [
                                "1112"
                            ]
                        }
                    ],
                    "cpu": [
                        {
                            "percent": [
                                "0.0"
                            ],
                            "percenttotal": [
                                "0.0"
                            ]
                        }
                    ],
                    "port": [
                        {
                            "hostname": [
                                "localhost"
                            ],
                            "portnumber": [
                                "25"
                            ],
                            "request": [
                                ""
                            ],
                            "protocol": [
                                "SMTP"
                            ],
                            "type": [
                                "TCP"
                            ],
                            "responsetime": [
                                "0.010"
                            ]
                        }
                    ]
                },
                {
                    "$": {
                        "name": "gdnsd"
                    },
                    "type": [
                        "3"
                    ],
                    "collected_sec": [
                        "1425832378"
                    ],
                    "collected_usec": [
                        "352780"
                    ],
                    "status": [
                        "0"
                    ],
                    "status_hint": [
                        "0"
                    ],
                    "monitor": [
                        "1"
                    ],
                    "monitormode": [
                        "0"
                    ],
                    "pendingaction": [
                        "0"
                    ],
                    "pid": [
                        "5718"
                    ],
                    "ppid": [
                        "1"
                    ],
                    "uptime": [
                        "61053"
                    ],
                    "children": [
                        "0"
                    ],
                    "memory": [
                        {
                            "percent": [
                                "0.0"
                            ],
                            "percenttotal": [
                                "0.0"
                            ],
                            "kilobyte": [
                                "2972"
                            ],
                            "kilobytetotal": [
                                "2972"
                            ]
                        }
                    ],
                    "cpu": [
                        {
                            "percent": [
                                "0.0"
                            ],
                            "percenttotal": [
                                "0.0"
                            ]
                        }
                    ],
                    "port": [
                        {
                            "hostname": [
                                "localhost"
                            ],
                            "portnumber": [
                                "53"
                            ],
                            "request": [
                                ""
                            ],
                            "protocol": [
                                "DNS"
                            ],
                            "type": [
                                "TCP"
                            ],
                            "responsetime": [
                                "0.000"
                            ]
                        }
                    ]
                },
                {
                    "$": {
                        "name": "salt.staging.wpdn"
                    },
                    "type": [
                        "5"
                    ],
                    "collected_sec": [
                        "1425832378"
                    ],
                    "collected_usec": [
                        "352803"
                    ],
                    "status": [
                        "0"
                    ],
                    "status_hint": [
                        "0"
                    ],
                    "monitor": [
                        "1"
                    ],
                    "monitormode": [
                        "0"
                    ],
                    "pendingaction": [
                        "0"
                    ],
                    "system": [
                        {
                            "load": [
                                {
                                    "avg01": [
                                        "1.12"
                                    ],
                                    "avg05": [
                                        "1.13"
                                    ],
                                    "avg15": [
                                        "1.08"
                                    ]
                                }
                            ],
                            "cpu": [
                                {
                                    "user": [
                                        "43.2"
                                    ],
                                    "system": [
                                        "8.8"
                                    ],
                                    "wait": [
                                        "0.0"
                                    ]
                                }
                            ],
                            "memory": [
                                {
                                    "percent": [
                                        "16.6"
                                    ],
                                    "kilobyte": [
                                        "673264"
                                    ]
                                }
                            ],
                            "swap": [
                                {
                                    "percent": [
                                        "0.0"
                                    ],
                                    "kilobyte": [
                                        "0"
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "$": {
                        "name": "openssh-server"
                    },
                    "type": [
                        "3"
                    ],
                    "collected_sec": [
                        "1425832378"
                    ],
                    "collected_usec": [
                        "352836"
                    ],
                    "status": [
                        "0"
                    ],
                    "status_hint": [
                        "0"
                    ],
                    "monitor": [
                        "1"
                    ],
                    "monitormode": [
                        "0"
                    ],
                    "pendingaction": [
                        "0"
                    ],
                    "pid": [
                        "981"
                    ],
                    "ppid": [
                        "1"
                    ],
                    "uptime": [
                        "149684"
                    ],
                    "children": [
                        "0"
                    ],
                    "memory": [
                        {
                            "percent": [
                                "0.0"
                            ],
                            "percenttotal": [
                                "0.0"
                            ],
                            "kilobyte": [
                                "3036"
                            ],
                            "kilobytetotal": [
                                "3036"
                            ]
                        }
                    ],
                    "cpu": [
                        {
                            "percent": [
                                "0.0"
                            ],
                            "percenttotal": [
                                "0.0"
                            ]
                        }
                    ]
                },
                {
                    "$": {
                        "name": "salt-minion"
                    },
                    "type": [
                        "3"
                    ],
                    "collected_sec": [
                        "1425832378"
                    ],
                    "collected_usec": [
                        "352859"
                    ],
                    "status": [
                        "0"
                    ],
                    "status_hint": [
                        "0"
                    ],
                    "monitor": [
                        "1"
                    ],
                    "monitormode": [
                        "0"
                    ],
                    "pendingaction": [
                        "0"
                    ],
                    "pid": [
                        "930"
                    ],
                    "ppid": [
                        "1"
                    ],
                    "uptime": [
                        "149684"
                    ],
                    "children": [
                        "0"
                    ],
                    "memory": [
                        {
                            "percent": [
                                "1.1"
                            ],
                            "percenttotal": [
                                "1.1"
                            ],
                            "kilobyte": [
                                "48216"
                            ],
                            "kilobytetotal": [
                                "48216"
                            ]
                        }
                    ],
                    "cpu": [
                        {
                            "percent": [
                                "0.0"
                            ],
                            "percenttotal": [
                                "0.0"
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    "servicegroups": [
        {
            "servicegroup": [
                {
                    "$": {
                        "name": "essentials"
                    },
                    "service": [
                        "salt-minion",
                        "openssh-server"
                    ]
                },
                {
                    "$": {
                        "name": "mail"
                    },
                    "service": [
                        "exim4"
                    ]
                },
                {
                    "$": {
                        "name": "salt"
                    },
                    "service": [
                        "salt-master"
                    ]
                },
                {
                    "$": {
                        "name": "logging"
                    },
                    "service": [
                        "syslog-ng"
                    ]
                }
            ]
        }
    ]
}
```
