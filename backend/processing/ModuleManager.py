'''
    MODULE MANAGER
    # Manages available processing modules
    # Dynamically loads modules, and provides methods for reloading modules
    # Stores information about modules available to pass to the frontend

'''
import os, importlib, inspect
from importlib import util


class ModuleManager:
    
    def __init__(self):
        self.modules_folder = "C:/Users/jacob/Desktop/4th Year Project/4yp/backend/modules" #define where modules are located
        self.modules_list = {
            "DefaultModules": [],
            "UserModules": [],
            "UtilityModules": []
        } #store information about modules

        self.loaded_modules = {}

        
    def load(self): # LOAD MODULES - Method to load all available modules
        
        sub_folders = ["DefaultModules", "UserModules", "UtilityModules"]


        # Loop through each of the module sub-folders
        for sub_folder in sub_folders:

            sub_module_folder = os.path.join(self.modules_folder, sub_folder) #subfolder path

            sub_folder_modules = []

            for file_name in os.listdir(sub_module_folder):
                if (file_name.endswith(".py") and file_name != "__init__.py"): #while looping find modules within subfolder
                    
                    module_path = os.path.join(sub_module_folder, file_name)

                    #load module into Module Manager
                    [module, module_name] = self.__loadmodule(file_name, module_path) 
                    
                    #Get module information
                    module_info = self.__getmoduleinfo(module, module_name)
                    sub_folder_modules.append(module_info) #add module info to modules list


            self.modules_list[sub_folder] = sub_folder_modules

        return self.loaded_modules #return modules to be used


    def reload(self): # RELOAD MODULES - Facade for module loading (to be used for better syntax if reloading is required)
        return self.load()
    

    def getModules(self): #GET MODULES - Method allows the frontend to retrieve modules list in a JSON serialisable format
        
        converted_modules_list = {
            "UtilityModules": [],
            "DefaultModules": [],
            "UserModules": []
        }

        module_list_id = 1

        for key in self.modules_list:
            
            json_serialisable_data = []

            for module in self.modules_list[key]:
                
                module_id = module_list_id + 0.1

                converted_module = {
                    'id': module_id,
                    "label": module['module_name'],
                    'module_name': module['module_name'],
                    'module_type': module['module_type'],
                    'module_inputs': {key: value.__name__ for key, value in module['module_inputs'].items()},
                    'module_outputs': {key: value.__name__ for key, value in module['module_outputs'].items()},
                    'module_params': module['module_params'],
                }

                json_serialisable_data.append(converted_module)

                module_id += 0.1
            
            converted_modules_list[key] = json_serialisable_data
            module_list_id += 1

            
            
        return converted_modules_list


    
    def __loadmodule(self, module_file, module_path): # Load a single module into the Module Manager (private method)
        
        module_name = os.path.splitext(module_file)[0]

        spec = importlib.util.spec_from_file_location(module_name, module_path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        self.loaded_modules[module_name] = module

        return [module, module_name]

    
    def __getmoduleinfo(self, module, module_name): # Get information on a module (private method)
    # Should return all module information in a dict entry
        
        moduleClass = getattr(module, module_name)

        module_info = {
            "module_name": "",
            "module_type": "",
            "module_inputs": "",
            "module_outputs": "",
            "module_params": ""
        }

        for key in module_info:
            module_info[key] = getattr(moduleClass, key)
        
        return module_info