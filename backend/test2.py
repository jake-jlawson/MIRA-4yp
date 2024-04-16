from processing.ModuleManager import ModuleManager
from modules.ProcessingModule import *


MODULE_MANAGER = ModuleManager()
modules = MODULE_MANAGER.load()

converted_list = MODULE_MANAGER.getModules()
print(converted_list)

