newLine = []
with open('C:\DS_Converter_Visualizer\pydss-projects\GSO_Industrial_Medium_sol_ihs3_idt226\DSSfiles\LoadShapes.dss','r') as profileFile:
    wholeLine=profileFile.readlines()
    for x in range(len(wholeLine)):
          newLine.append(wholeLine[x].replace('../../../../..','C:/DS_Converter_Visualizer'))
with open('C:\DS_Converter_Visualizer\pydss-projects\GSO_Industrial_Medium_sol_ihs3_idt226\DSSfiles\LoadShapes.dss','w') as writeFile:
    for y in range(len(newLine)):
        writeFile.write(newLine[y])

