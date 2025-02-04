export interface FaceData {
    index: number
    gender: string
    age: string
    expression: string
    confidence: {
      gender: string
      expression: string
    }
    box: {
      x: number
      y: number
      width: number
      height: number
    }
  }
  
  