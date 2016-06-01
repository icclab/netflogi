## Netfflogi - Graphical Interface for Netfloc

Netflogi is a frontend for the [SDK for SDN - Netfloc](http://icclab.github.io/netfloc/ "Netfloc's github page") intended to provide graphical interface for the Netfloc libraries. Using Netflogi, the user is able to create and delete Service Function Chains (SFCs). 

### Prepare Netflogi

* Prerequisites: NodeJS and Netfloc running.

* Start the nodejs server: ```nodejs index.js```

* The first time you need to input your local configuration for Netflogi based on the OpenStack services and the Netfloc endpoints. This is saved in a ***config.js*** file.

```
guiPort:  [Port where you like to run the Netflogi]
netflocHost:  [Host where Netloc runs]
netflocPort:  [Port of the Netfloc Restconf service]
netflocAuth:  [user:password for Netfloc]
keystoneHost:  [Host of the OpenStack Keystone service]
keystonePort:  [Port of the OpenStack Keystone service]
keystoneUser:  [Username for Keystone authentication]
keystonePass:  [Password for Keystone authentication]
keystoneTenant:  [Tenant ID]
neutronHost:  [Host of the OpenStack Neutron service]
neutronPort:  [Port of the OpenStack Neutron service]
```

* Acccess the Netflogi service running locally at the following URL:

```
http://[netflogiHost]:[netflogiPort]
```


### Use Netflogi

* For the moment only the Service Function Chaining (SFC) under Services is fully implemented and working. To create SFC from ```Create Service Chain``` popup window, you need to input the number of ports involved in the chain.

* From the ports list, the user can choose the order of the ports as they would appear in the chain. Note: At current implementation [Netfloc](http://icclab.github.io/netfloc) (the SFC server) requires a minimum of 4 ports for the chain (example: sender\_sfc, vnf\_in, vnf\_out, receiver\_sfc).

* The ports of the Chain are defined by their: MAC addresses, IPs and Neutron IDs. 

* To delete a Service Chain, select one or multiple existing Service Chains (defined by their IDs). This can be done from the drop down ```Chain Actions``` menu.

###Contributions 

* Netflogi is a project under development created in the ICCLab. It has a modular design, so that the functionality can be easily extended with new views and templates on demand. All contributions are welcomed. 

* The new version of Netflogi included in the branch ***netflogi-extended***) allows to manage chains out of Virtual Network Functions (VNFs). Note that at current stage the new features are not fully integrated with the master version. 

### License

Netflogi is licensed under the
[Apache License version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

### Made by

<div align="center" >
<a href='http://blog.zhaw.ch/icclab'>
<img src="https://raw.githubusercontent.com/icclab/netfloc/master/docs/img/se_sp_logo.jpg" title="icclab_logo" width=500px>
</a>
</div>