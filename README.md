## Netfflogi - extended

Netflogi is a frontend for the [SDK for SDN - Netfloc](http://icclab.github.io/netfloc/ "Netfloc's github page") intended to provide graphical use of the Netfloc libraries. In this version, it is possible to create/delete Virtual Network Functions (VNFs) and manage Service Function Chains (SFCs) related to VNFs (not Ports as in the master). 

### New features of the Netflogi

* Create VNF
* Delete VNF
* Create SFC from VNFs
* Delete a SFC

### Prepare Netflogi

* Prerequisites: NodeJS and Netfloc running.

* Start the nodejs server: ```nodejs index.js```

* The first time you need to input your local configuration for the Netflogi based on the OpenStack services and the Netfloc endpoints. This is saved in a ***config.js*** file.

```
guiPort:  [Port where you like to run Netflogi]
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

* To create a VNF, choose ```Services->Virtual Network Functions``` from the menu bar once you entered ```Services->Service Function Chaining``` and input a name, description, and select an ingress and egress port from the neutron ports list. You can see that the VNF has been successfuly created.

* One or multiple selected VNFs can be deleted.

* To create a Service Chain on ```Services->Create Service Chain``` you can choose the number and the order of VNFs as they appear in the chain. 

* To delete one or multiple existing chains, use the  ```Chain Actions->Delete``` option.

###Contributions 

* Netflogi is a project under development created in the ICCLab. It has a modular design, so that the functionality can be easily extended with new views and templates on demand. All contributions are welcomed. 

* The new version of Netflogi included in the branch ***netflogi-extended***) allows to manage chians out of Virtual Network Functions (VNFs). Note that at current stage the new features are not fully integrated with the master version. 

### License

Netflogi is licensed under the
[Apache License version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

### Made by

<div align="center" >
<a href='http://blog.zhaw.ch/icclab'>
<img src="https://raw.githubusercontent.com/icclab/netfloc/master/docs/img/se_sp_logo.jpg" title="icclab_logo" width=500px>
</a>
</div>

