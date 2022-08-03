# HELICS CMake module
# This module sets the following variables in your project::
#
#   HELICS_FOUND - true if HELICS found on the system
#   HELICS_INCLUDE_DIR - the directory containing HELICS headers for the C shared library if available
#   HELICS_C_SHARED_LIBRARY - the C shared library
#   HELICS_CXX_SHARED_LIBRARY -the C++ shared library
#   It also creates the following targets if they are available (not all are always built depending on the configuration)
#   HELICS::helics for the C based shared library
#   HELICS::helicscpp for the C++ based shared library
#   HELICS::helicscpp98 for the C++98 header only library wrapper for the C shared library
#   HELICS::helics_player is an executable target for the HELICS player
#   HELICS::helics_broker is an executable target for the helics broker executable
#   HELICS::helics_recorder is an executable target for the helics_recorder executable
#   HELICS::helics_app is an executable target for the helics_app executable
#   HELICS::helics_broker_server is an executable target for the helics_broker_server executable


####### Expanded from @PACKAGE_INIT@ by configure_package_config_file() #######
####### Any changes to this file will be overwritten by the next CMake run ####
####### The input file was HELICSConfig.cmake.in                            ########

get_filename_component(PACKAGE_PREFIX_DIR "${CMAKE_CURRENT_LIST_DIR}/../../../" ABSOLUTE)

macro(set_and_check _var _file)
  set(${_var} "${_file}")
  if(NOT EXISTS "${_file}")
    message(FATAL_ERROR "File or directory ${_file} referenced by variable ${_var} does not exist !")
  endif()
endmacro()

macro(check_required_components _NAME)
  foreach(comp ${${_NAME}_FIND_COMPONENTS})
    if(NOT ${_NAME}_${comp}_FOUND)
      if(${_NAME}_FIND_REQUIRED_${comp})
        set(${_NAME}_FOUND FALSE)
      endif()
    endif()
  endforeach()
endmacro()

####################################################################################

set(PN HELICS)
set(SAVED_PARENT_CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH})
set(CMAKE_MODULE_PATH ${CMAKE_CURRENT_LIST_DIR})

include(CMakeFindDependencyMacro)

include(${CMAKE_CURRENT_LIST_DIR}/helics-targets.cmake)

if (NOT OFF)
    get_target_property(${PN}_C_SHARED_LIBRARY HELICS::helics LOCATION)
endif()

if (OFF)
    get_target_property(${PN}_CXX_SHARED_LIBRARY HELICS::helicscpp LOCATION)
endif()

if (NOT OFF)
    get_target_property(${PN}_INCLUDE_DIRS HELICS::helics INTERFACE_INCLUDE_DIRECTORIES)
    message(STATUS "HELICS_INCLUDE_DIRS HELICS: ${HELICS_INCLUDE_DIRS}")
    message(STATUS "HELICS_C_SHARED_LIBRARY: ${HELICS_C_SHARED_LIBRARY}")

    if (EXISTS "${PACKAGE_PREFIX_DIR}/share/helics/swig/helics.i")
        set(${PN}_SWIG_INCLUDE_DIRS "${PACKAGE_PREFIX_DIR}/share/helics/swig")
        foreach(TMPDIR IN LISTS ${PN}_INCLUDE_DIRS)
            list(APPEND ${PN}_SWIG_INCLUDE_DIRS "${TMPDIR}/helics/shared_api_library")
        endforeach()
        message(STATUS "HELICS_SWIG_INCLUDE_DIRS: ${HELICS_SWIG_INCLUDE_DIRS}")
    endif()
endif()

check_required_components(${PN})

set(CMAKE_MODULE_PATH ${SAVED_PARENT_CMAKE_MODULE_PATH})
