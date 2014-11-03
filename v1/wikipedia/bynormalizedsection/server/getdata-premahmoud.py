#!/usr/bin/python

import re
import json
import requests
import cgi
import cgitb
import copy
# cgitb.enable()

print "Content-Type: text/plain;charset=utf-8\n\n"


def getStructuredFile(query):
	try:
		cached_file = open(filepath+"structured_"+query+".json", "r+")
	except:
		print "couldn't access it"
	print cached_file.read()
	# result_string = cached_file.read()
	cached_file.close()
	# print result_string


def createStructuredFile(query):
	############### Get Table of Contents  #############
	toc_dict = {} # The lookup dict for later parsing the comments for sections
	rawpagedata = requests.get('http://en.wikipedia.org/w/api.php?action=parse&page='+query+'&format=json&redirects=true', auth=('user', 'pass'))
	pagedata = json.loads(rawpagedata.text)
	pagedata = pagedata['parse']
	toc = pagedata['sections']
	group_dict = {}
	group_dict[-1] = []
	group_dict[-2] = []


	for each in toc:
		group = int(re.match(r'(\d+)', each['number']).group())
		each['group'] = group
		if each['toclevel'] == 1:
			group_dict[group] = []
		toc_key = each['line']
		if toc_key.find("<") > 0: 
			toc_key = re.search(r'(.*?)<.*>', toc_key).groups()[0]
		toc_dict[toc_key] = each

	############## GET CACHED DATA #############
	# try:
	# 	# Get cached revisions history
	# 	rawrevdata = open("./data/cached_"+query+".json", "r")
	# 	revdata = json.load(rawrevdata)

	# except:
	# 	# Get revisions history
	# 	rawrevdata = requests.get('http://ortelius.toolserver.org:8089/revisions/'+query, auth=('user', 'pass'))
	# 	revdata = json.loads(rawrevdata.text)
	# 	# Write it to cache for next time
	# 	myfile = open("./data/cached_"+query+".json", "w+")
	# 	myfile.write(json.dumps(revdata))
	# 	myfile.close()

	rawrevdata = requests.get('http://ortelius.toolserver.org:8089/revisions/'+query, auth=('user', 'pass'))
	revdata = json.loads(rawrevdata.text)

	############### STRUCTURE DATA ###################
	final_revisions = [] # The Final dictionary of data
	sorted_by_section = {}
	revert_dict = {} # The lookup placeholder dict for revert-matching
	revisions = revdata["result"]
	issorted = 0
	oldsections = 0
	unsorted = 0

	for index, rev in enumerate(revisions):
		thiscomment = rev['rev_comment']

		# look for the section in the comment
		section_name = re.search(r'(/\*\s(.*?)\s\*/)', thiscomment) # What about duplicate seciton titles?
		if (section_name):
			section_name = section_name.groups()[1]
			try:
				section_num = toc_dict[section_name]['number']
				section_group = toc_dict[section_name]['group']
				issorted+=1
			except:
				section_num = '-2' # Should we have a separate group for Old Sections?
				section_group = -2
				oldsections +=1
		else:
			section_name = None
			section_num = '-1'
			section_group = -1
			unsorted += 1


		# check if it's a revert
		undid = re.search(r'([Uu]ndid revision)', thiscomment)
		revert = re.search(r'([Rr]evert)', thiscomment)
		if (revert or undid):
			rev_isrevert = True
			# look for who you're reverting
			try:
				bywhom = re.search(r'(by\s\[\[Special:Contributions/(.*?)\|)', thiscomment)
				bywhom = bywhom.groups()[1]
				try: 
					# Find the edit that this is reverting
					match = revert_dict[bywhom].pop()
					final_revisions[match]['rev_wasreverted'] = True
					final_revisions[match]['rev_revertedby'] = rev['rev_user_text']
					final_revisions[match]['rev_reverterid'] = index
					# Grab and transfer the section from the edit, if possible
					if (final_revisions[match]['rev_section_group'] > 0) and (section_group < 0):
						section_name = final_revisions[match]["rev_section_name"]
						section_num = final_revisions[match]["rev_section_num"]
						section_group = final_revisions[match]["rev_section_group"]
						unsorted-=1
						issorted+=1
				except:
					# print "couldn't find match: "+ thiscomment
					pass
			except:
				# print "couldn't find bywhom: "+ thiscomment
				pass
		
		else: # Add it to the lookup dictionary
			rev_isrevert = False
			try:
				revert_dict[rev['rev_user_text']].append(index)
			except:
				revert_dict[rev['rev_user_text']] = [index]


		############### WRITE DATA ###################
		thisentry = {
			'rev_id': rev['rev_id'], 
			'rev_user_text': rev['rev_user_text'], 
			'rev_comment': rev['rev_comment'], 
			'rev_minor_edit': rev['rev_minor_edit'], 
			'rev_isrevert': rev_isrevert,
			'rev_wasreverted': False,
			'rev_revertedby': None,
			'rev_section_name': section_name,
			'rev_section_num': section_num,
			'rev_section_group': section_group,
			'rev_timestamp': rev['rev_timestamp'],
			'rev_year': rev['rev_timestamp'][0:4],
			'rev_month': rev['rev_timestamp'][4:6]
		}
		datekey = str(rev['rev_timestamp'][0:4])+'-'+str(rev['rev_timestamp'][4:6])

		try:
			sorted_by_section[datekey][section_group].append("date: "+datekey+", section: "+section_group)
			# sorted_by_section[datekey][section_group].append(thisentry)
		except:
			sorted_by_section[datekey] = group_dict
			sorted_by_section[datekey][section_group] = ["date: "+str(datekey)+", section: "+str(section_group)]
			# sorted_by_section[datekey][section_group] = [thisentry]

		# final_revisions.append(thisentry)	

	final_result = {"revisions": sorted_by_section, "sections": toc}
	result = json.dumps(final_result, indent=2)

	f = open(filepath+"structured_"+query+".json", "w+")
	f.write(result)
	f.close()

	print result


##############################################

try:
    params = cgi.FieldStorage()
    query = params.getvalue('query')
    
except:
	pass

if query==None:
	query = 'Coffee'

filepath = 'server/data'
# 	filepath = "data/"

try:
	getStructuredFile(query)
except:
	# createStructuredFile(query)
	print "Can't access"
# createStructuredFile(query)