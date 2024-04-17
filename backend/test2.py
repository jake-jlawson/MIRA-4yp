from processing.ModuleManager import ModuleManager
from backend.modules.Modules import *


MODULE_MANAGER = ModuleManager()
modules = MODULE_MANAGER.load()

converted_list = MODULE_MANAGER.getModules()
print(converted_list)

