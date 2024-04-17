from typing import Type, Dict, List
from abc import ABC, abstractmethod


'''
    PROCESSING MODULE BASE CLASS:
    For any module that intends to do complex processing
'''
__all__ = ["ProcessingModule", "SourceModule"]

class ProcessingModule(ABC):

    """
        MODULE PROPERTIES: Must be defined for each module
    """

    @property # NAME: must define a unique name for your module
    @abstractmethod
    def module_name(self) -> str:
        ...

    @property # TYPE: must define a type for your module - the type usually is based on what sort of feature it extracts
    @abstractmethod
    def module_type(self) -> str:
        ...

    @property # INPUTS: must define the input type of your module
    @abstractmethod
    def module_inputs(self) -> List[Type]:
        ...

    @property # OUTPUTS: must define the output type of your module
    @abstractmethod
    def module_outputs(self) -> List[Type]:
        ...

    
    
    """
        MODULE ACTIONS: Must be defined for each module
    """
    def run(self, **inputs):

        #TYPE CHECKING
        expected_inputs = ', '.join([t.__name__ for t in self.module_inputs])

        # check the number of inputs
        if (len(inputs) != len(self.module_inputs)):
            raise ValueError(f"Wrong number of inputs provided for {self.module_name}. Expected {len(self.module_inputs)} input(s): {expected_inputs}")
        
        # check input types

        # Run the module process
        output = self.process(**inputs)

        return output
            
    
    @abstractmethod
    def process(self, **kwargs):
        ...