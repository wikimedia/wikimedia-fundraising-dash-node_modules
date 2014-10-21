var dns = require('dns'),
	net = require('net'),
	dnsLookup = dns.lookup;
	domains = [];

/**
 * Override core DNS lookup function
 **/

dns.lookup = function(domain, family, callback) {
	var i;

	if (arguments.length === 2) {
		callback = family;
		family = 0;
	} 
	else if (!family) {
		family = 0;
	} 
	else {
		family = +family;
		if (family !== 4 && family !== 6) {
			throw new Error('invalid argument: `family` must be 4 or 6');
		}
	}

	for (i = 0; i < domains.length; i++) {
		if (domain.match(domains[i].domain)) {
			if (!family || family === domain[i].family) {
				return callback(null, domains[i].ip, family);
			}			
		}
	}

	return dnsLookup.call(this, domain, family, callback);
};

/**
 * Add a domain to the override list
 *
 * @param domain String or RegExp matching domain
 * @param ip String IPv4 or IPv6
 **/

function add(domain, ip) {
	var entry = { ip: ip };

	if (net.isIPv4(entry.ip)) {
		entry.family = 4;
	}
	else if (net.isIPv6(entry.ip)) {
		entry.family = 6;
	}
	else {
		throw new Error('Invalid ip: ' + entry.ip);
	}

	if (domain instanceof RegExp) {
		entry.source = domain;
		entry.domain = domain;
	}
	else {
		entry.source = domain;
		entry.domain = createRegex(domain);
	}

	domains.push(entry);
}

/**
 * Remove a domain from the override list
 * 
 * @param domain String or RegExp
 * @param ip String optional, if not set all domains equivalent domain will be removed
 **/
function remove(domain, ip) {
	var i;

	for (i = 0; i < domains.length; i++) {
		if (domain instanceof RegExp) {
			if (domains[i].source  instanceof RegExp
				&& domains[i].source.source === domain.source
				&& (!ip || ip === domains[i].ip)) {

				domains.splice(i, 1);
				i--;
			}
		}
		else {
			if (domains[i].source === domain && (!ip || ip === domains[i].ip)) {
				domains.splice(i, 1);
				i--;
			}
		}
		
	}
}

function createRegex(val) {
	var parts = val.split('*'),
		i;

	for (i = 0; i < parts.length; i++) {
		parts[i] = regexEscape(parts[i]);
	}

	val = parts.join('.*');
	val = '^' + val + '$';

	return new RegExp(val, 'i');
};


function regexEscape(val) {
	return val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = {
	add: add,
	remove: remove,
	domains: domains
};