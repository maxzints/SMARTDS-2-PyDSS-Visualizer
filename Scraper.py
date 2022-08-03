"""
This program sorts through the AWS S3 Explorer for the Open Energy Data Initiative website to
"""

from fileinput import close
from bs4 import BeautifulSoup
import requests
import os
import PyDSS


GSO_rural_profile_web_address = f'https://data.openei.org/s3_viewer?bucket=oedi-data-lake&limit=100&prefix=SMART-DS%2Fv1.0%2F2018%2FGSO%2Frural%2Fprofiles%2F&offset='
GSO_industrial_profile_web_address = f'https://data.openei.org/s3_viewer?bucket=oedi-data-lake&limit=100&prefix=SMART-DS%2Fv1.0%2F2018%2FGSO%2Findustrial%2Fprofiles%2F&offset='
SFO_urban_profile_web_address = f'https://data.openei.org/s3_viewer?bucket=oedi-data-lake&limit=100&prefix=SMART-DS%2Fv1.0%2F2018%2FSFO%2FP2U%2Fprofiles%2F&offset='

GSO_rural_DSS_file_web_address = f'https://data.openei.org/s3_viewer?bucket=oedi-data-lake&prefix=SMART-DS%2Fv1.0%2F2018%2FGSO%2Frural%2Fscenarios%2Fbase_timeseries%2Fopendss%2Frhs1_1247%2Frhs1_1247--rdt137%2F'
GSO_urban_DSS_file_web_address = f'https://data.openei.org/s3_viewer?bucket=oedi-data-lake&prefix=SMART-DS%2Fv1.0%2F2018%2FGSO%2Frural%2Fscenarios%2Fbase_timeseries%2Fopendss%2Frhs1_1247%2Frhs1_1247--rdt137%2F'
class dataSource:
    def __init__(self,name,link,profile,offset):
        self.name = name
        self.link = link
        self.request = requests.get(self.link).text
        self.offset = offset
        self.profile = profile
        self.profileRequest = requests.get(f'{self.profile}{self.offset}').text
        



#Below are all of the datasets I used, if you want to add new ones, create a new set object, assign it the proper attributes, and add it to the datasets list
set0 = dataSource('GSO_Rural_Base_rhs1_rdt137',GSO_rural_DSS_file_web_address,GSO_rural_profile_web_address,0)
set1 = dataSource('GSO_Rural_Medium_sol_rhs0_rdt1528','https://data.openei.org/s3_viewer?bucket=oedi-data-lake&prefix=SMART-DS%2Fv1.0%2F2018%2FGSO%2Frural%2Fscenarios%2Fsolar_medium_batteries_low_timeseries%2Fopendss%2Frhs0_1247%2Frhs0_1247--rdt1527%2F',GSO_rural_profile_web_address,0)
set2 = dataSource('GSO_Industrial_Base_ihs0_idt629','https://data.openei.org/s3_viewer?bucket=oedi-data-lake&prefix=SMART-DS%2Fv1.0%2F2018%2FGSO%2Findustrial%2Fscenarios%2Fbase_timeseries%2Fopendss%2Fihs0_1247%2Fihs0_1247--idt629%2F',GSO_industrial_profile_web_address,0)
set3 = dataSource('GSO_Industrial_Medium_sol_ihs3_idt226','https://data.openei.org/s3_viewer?bucket=oedi-data-lake&prefix=SMART-DS%2Fv1.0%2F2018%2FGSO%2Findustrial%2Fscenarios%2Fsolar_medium_batteries_low_timeseries%2Fopendss%2Fihs3_1247%2Fihs3_1247--idt226%2F',GSO_industrial_profile_web_address,0)
set4 = dataSource('SFO_Urban_Base_p2uhs2_p2udt3761','https://data.openei.org/s3_viewer?bucket=oedi-data-lake&prefix=SMART-DS%2Fv1.0%2F2018%2FSFO%2FP2U%2Fscenarios%2Fbase_timeseries%2Fopendss%2Fp2uhs2_1247%2Fp2uhs2_1247--p2udt3761%2F',SFO_urban_profile_web_address,0)
set5 = dataSource('SFO_Urban_Medium_sol_p2uhs12_udt4058','https://data.openei.org/s3_viewer?bucket=oedi-data-lake&prefix=SMART-DS%2Fv1.0%2F2018%2FSFO%2FP2U%2Fscenarios%2Fsolar_medium_batteries_low_timeseries%2Fopendss%2Fp2uhs12_1247%2Fp2uhs12_1247--p2udt4058%2F',SFO_urban_profile_web_address,0)



datasets = [set0,set1,set2,set3,set4,set5]

#PUT THE DSS files into the DSSfiles folders


for z in range (0,len(datasets),1):
    os.chdir(f'C:\DS_Converter_Visualizer') #enter file created to put DSS files in
    try: os.mkdir(f'profiles')
    except:
        print(f'The PROFILES folder should already be made')
        pass

    os.chdir(f'C:\DS_Converter_Visualizer\pydss-projects\{datasets[z].name}\DSSfiles')
    soup = BeautifulSoup(datasets[z].request,'lxml') #Request the lxml file from the link
    datalist = []
    for dataTable in soup.find_all('a', href=True):
        datalist.append(dataTable['href']) #list all of the downloadable files in datalist
    for x in range(0,len(datalist),1): 
        if '.dss' in datalist[x]: #only download the files with .dss at the end
            response = requests.get(datalist[x])
            filename = datalist[x].split('/')
            with open(filename[-1], "w") as file:
                file.write(response.text)

    loadShape = open('LoadShapes.dss','r+')
    neededProfiles,weeweeline,iJustWantToWork = [],[],[]
    while loadShape:
        wholeLine= loadShape.readline()
        ppline = wholeLine.split('/')
        for wee in range(len(ppline)):
            weeweeline.append(ppline[wee].split(')'))
        for weewee in range(len(weeweeline)):
            if len(weeweeline[weewee]) == 2 and weeweeline[weewee][0] not in iJustWantToWork:
                iJustWantToWork.append(weeweeline[weewee][0])
        #if len(ppline) > 1:
            #neededProfiles.append(profileName[1].replace('Loadshape.',''))
        if wholeLine == '': break
        # print(neededProfiles)
    loadShape.close()

    #Put csv files into profiles folder
    os.chdir('C:\DS_Converter_Visualizer\profiles')
    profileSoup = BeautifulSoup(datasets[z].profileRequest,'lxml')
    profileList = []
    csvList = []
    matches = 0
    profiles_not_found = []
    for item in range(0,len(iJustWantToWork),1):
        profiles_not_found.append(iJustWantToWork[item])
    status = profileSoup.find(role='status').text
    number_of_entries = status.split('of ')
    almost_fixed = number_of_entries[1].replace(' entries','')

    while matches < len(iJustWantToWork) and (datasets[z].offset - 100) < int(almost_fixed.replace(',','')):
        #Create a list of all of the links to .csv files in csvList
        for profileTable in profileSoup.find_all('a', href = True):
            profileList.append(profileTable['href'])
        for csv in range(0,len(profileList),1):
            if '.csv' in profileList[csv]:
                csvList.append(profileList[csv])
    
        #Check if any of the csv files in neededProfiles are in csvList
        for y in range(0,len(csvList)):
            for bruh in range (0,len(iJustWantToWork),1):
                if iJustWantToWork[bruh] in csvList[y]:
                    #if they do match, open the link to the .csv file and write it into the profiles folder, increment matches
                    profiles_not_found.remove(iJustWantToWork[bruh])
                    if iJustWantToWork[bruh] not in os.listdir('C:\DS_Converter_Visualizer\profiles'):
                        getProfile = requests.get(csvList[y])
                        profileFileName = csvList[y].split('/')
                        print(f"Found and saved {profileFileName[-1]} from page {int((datasets[z].offset+100) / 100)}")
                        with open(profileFileName[-1],'w') as profileFile:
                            profileFile.write(getProfile.text)
                        break
                    matches += 1
                    print(f'The scraper has found {matches} CSV files out of the {len(iJustWantToWork)} required for {datasets[z].name}')
                    
        print(f"Couldn't find any matches in {datasets[z].offset + 1} to {datasets[z].offset + 100}, clearing and going to next page")
        profileList.clear()
        csvList.clear()
        datasets[z].offset += 100
        #go to new, offset page
        datasets[z].profileRequest = requests.get(f'{datasets[z].profile}{datasets[z].offset}').text
        profileSoup = BeautifulSoup(f'{datasets[z].profileRequest}','lxml')
                #if none of the neededProfiles are in this profile list, clear the profile list, go to the next page
        
    print(f'There were {len(profiles_not_found)} profiles not found, they are:')
    for n in range(0,len(profiles_not_found),1):
        print(profiles_not_found[n])
    newLine = []
    with open(f'C:\DS_Converter_Visualizer\pydss-projects\{datasets[z].name}\DSSfiles\LoadShapes.dss','r') as profileFile:
        wholeLine=profileFile.readlines()
        for x in range(len(wholeLine)):
            newLine.append(wholeLine[x].replace('../../../../..','/DS_Converter_Visualizer'))
    with open(f'C:\DS_Converter_Visualizer\pydss-projects\{datasets[z].name}\DSSfiles\LoadShapes.dss','w') as writeFile:
        for y in range(len(newLine)):
            #print(newLine[y])
            writeFile.write(newLine[y])


print('Done!')