"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle, Trash2, BookOpen, GraduationCap, Calculator, Info, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion, AnimatePresence } from "framer-motion"

interface Subject {
  id: string
  name: string
  grade: string
}

interface AcademicFormProps {
  onSubmit: (weight: string, level: string) => void
}

const gradeOptions = {
  "a-level": ["A", "B", "C", "D", "E", "O", "F"],
  "o-level": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "X", "Y", "Z"],
}

const subjectOptions = {
  "a-level": [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Geography",
    "History",
    "Economics",
    "Literature",
    "Computer Science",
    "Fine Art",
    "Divinity",
    "Agriculture",
  ],
  "o-level": [
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "Geography",
    "History",
    "Commerce",
    "Computer Studies",
    "Fine Art",
    "Religious Education",
    "Agriculture",
  ],
}

// Grade point values for calculation
const gradePoints = {
  "a-level": { A: 6, B: 5, C: 4, D: 3, E: 2, O: 1, F: 0 },
  "o-level": {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    X: 0,
    Y: 0,
    Z: 0,
  },
}

export default function AcademicForm({ onSubmit }: AcademicFormProps) {
  // Selected level for submission
  const [selectedLevel, setSelectedLevel] = useState<"a-level" | "o-level">("a-level")
  
  // Maintain separate state for A-level and O-level subjects
  const [aLevelSubjects, setALevelSubjects] = useState<Subject[]>([
    { id: "a1", name: "", grade: "" },
  ])
  const [oLevelSubjects, setOLevelSubjects] = useState<Subject[]>([
    { id: "o1", name: "", grade: "" },
  ])

  // Total points for each level
  const [aLevelPoints, setALevelPoints] = useState<string>("")
  const [oLevelPoints, setOLevelPoints] = useState<string>("")
  
  // Animation states
  const [isCalculatingALevel, setIsCalculatingALevel] = useState(false)
  const [isCalculatingOLevel, setIsCalculatingOLevel] = useState(false)

  // Calculate the current totals based on selected subjects and grades
  const calculatedALevelTotal = aLevelSubjects.reduce((total, subject) => {
    if (!subject.grade) return total
    return (
      total + (gradePoints["a-level"][subject.grade as keyof typeof gradePoints["a-level"]] || 0)
    )
  }, 0)

  const calculatedOLevelTotal = oLevelSubjects.reduce((total, subject) => {
    if (!subject.grade) return total
    return (
      total + (gradePoints["o-level"][subject.grade as keyof typeof gradePoints["o-level"]] || 0)
    )
  }, 0)

  // Trigger calculation animation when subjects or grades change
  useEffect(() => {
    if (aLevelSubjects.some(subject => subject.name && subject.grade)) {
      setIsCalculatingALevel(true)
      const timer = setTimeout(() => {
        setIsCalculatingALevel(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [aLevelSubjects])

  useEffect(() => {
    if (oLevelSubjects.some(subject => subject.name && subject.grade)) {
      setIsCalculatingOLevel(true)
      const timer = setTimeout(() => {
        setIsCalculatingOLevel(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [oLevelSubjects])

  const addSubject = (level: "a-level" | "o-level") => {
    if (level === "a-level") {
      setALevelSubjects([
        ...aLevelSubjects,
        { id: `a${Date.now()}`, name: "", grade: "" },
      ])
    } else {
      setOLevelSubjects([
        ...oLevelSubjects,
        { id: `o${Date.now()}`, name: "", grade: "" },
      ])
    }
  }

  const removeSubject = (level: "a-level" | "o-level", id: string) => {
    if (level === "a-level") {
      if (aLevelSubjects.length > 1) {
        setALevelSubjects(aLevelSubjects.filter((subject) => subject.id !== id))
      }
    } else {
      if (oLevelSubjects.length > 1) {
        setOLevelSubjects(oLevelSubjects.filter((subject) => subject.id !== id))
      }
    }
  }

  const updateSubject = (
    level: "a-level" | "o-level",
    id: string,
    field: "name" | "grade",
    value: string,
  ) => {
    if (level === "a-level") {
      setALevelSubjects(
        aLevelSubjects.map((subject) =>
          subject.id === id ? { ...subject, [field]: value } : subject,
        )
      )
    } else {
      setOLevelSubjects(
        oLevelSubjects.map((subject) =>
          subject.id === id ? { ...subject, [field]: value } : subject,
        )
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate weight or use provided total points based on selected level
    let calculatedWeight = ""
    if (selectedLevel === "a-level") {
      calculatedWeight = aLevelPoints || calculatedALevelTotal.toString()
    } else {
      calculatedWeight = oLevelPoints || calculatedOLevelTotal.toString()
    }

    // Call the onSubmit callback with the calculated weight and level
    onSubmit(calculatedWeight, selectedLevel)
  }

  // Check if form is valid (at least one subject with name and grade in the selected level)
  const isFormValid = selectedLevel === "a-level" 
    ? aLevelSubjects.some((subject) => subject.name && subject.grade)
    : oLevelSubjects.some((subject) => subject.name && subject.grade)

  // Get remaining subjects that haven't been selected yet
  const remainingALevelSubjects = subjectOptions["a-level"].filter(
    option => !aLevelSubjects.some(subject => subject.name === option)
  )
  
  const remainingOLevelSubjects = subjectOptions["o-level"].filter(
    option => !oLevelSubjects.some(subject => subject.name === option)
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Level Selection */}
      <Card className="border-green-500/20 shadow-md">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-green-500" />
            Select Your Education Level
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <RadioGroup 
            value={selectedLevel} 
            onValueChange={(value) => setSelectedLevel(value as "a-level" | "o-level")}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="a-level" id="a-level" className="text-green-500 border-green-500" />
              <Label htmlFor="a-level" className="font-medium cursor-pointer">A-Level Results</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="o-level" id="o-level" className="text-green-500 border-green-500" />
              <Label htmlFor="o-level" className="font-medium cursor-pointer">O-Level Results</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* A-Level Section */}
      <Card className="border-green-500/20 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-green-500" />
            A-Level Subjects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {aLevelSubjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden border-green-500/10 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="grid flex-1 gap-1.5">
                          <Label
                            htmlFor={`subject-${subject.id}`}
                            className="text-sm font-medium flex items-center gap-1"
                          >
                            Subject {index + 1}
                            {subject.name && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" />
                            )}
                          </Label>
                          <Select
                            value={subject.name}
                            onValueChange={(value) =>
                              updateSubject("a-level", subject.id, "name", value)
                            }
                          >
                            <SelectTrigger
                              id={`subject-${subject.id}`}
                              className={`bg-white dark:bg-gray-950 ${
                                subject.name ? "border-green-500/50" : ""
                              }`}
                            >
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Show the current selection first */}
                              {subject.name && (
                                <SelectItem key={subject.name} value={subject.name}>
                                  {subject.name}
                                </SelectItem>
                              )}
                              
                              {/* Then show remaining options */}
                              {remainingALevelSubjects.map((subjectName) => (
                                <SelectItem key={subjectName} value={subjectName}>
                                  {subjectName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid w-full sm:w-32 gap-1.5">
                          <Label
                            htmlFor={`grade-${subject.id}`}
                            className="text-sm font-medium flex items-center gap-1"
                          >
                            Grade
                            {subject.grade && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" />
                            )}
                          </Label>
                          <Select
                            value={subject.grade}
                            onValueChange={(value) =>
                              updateSubject("a-level", subject.id, "grade", value)
                            }
                          >
                            <SelectTrigger
                              id={`grade-${subject.id}`}
                              className={`bg-white dark:bg-gray-950 ${
                                subject.grade ? "border-green-500/50" : ""
                              }`}
                            >
                              <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {gradeOptions["a-level"].map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="self-end text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-10 w-10 rounded-full"
                                onClick={() => removeSubject("a-level", subject.id)}
                                disabled={aLevelSubjects.length <= 1}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove subject</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove subject</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      {/* Show points for this subject if both name and grade are selected */}
                      {subject.name && subject.grade && (
                        <div className="mt-2 text-right">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {gradePoints["a-level"][subject.grade as keyof typeof gradePoints["a-level"]]} points
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full mt-4 border-dashed border-green-500/50 hover:border-green-500 hover:bg-green-50 text-green-700"
            onClick={() => addSubject("a-level")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add A-Level Subject
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end mt-4">
            <div className="grid gap-1.5 flex-1">
              <Label htmlFor="a-level-points" className="text-sm font-medium flex items-center gap-1">
                A-Level Total Points (Optional)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Enter your total A-Level points if you already know them, otherwise we'll calculate them based on your subjects and grades.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="a-level-points"
                type="number"
                placeholder="Enter your total A-Level points if known"
                value={aLevelPoints}
                onChange={(e) => setALevelPoints(e.target.value)}
                className="bg-white dark:bg-gray-950"
              />
            </div>

            <div className="flex items-center gap-2 min-w-[140px]">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Calculator className={`h-4 w-4 ${isCalculatingALevel ? "animate-pulse text-green-500" : ""}`} />
                Calculated:
              </div>
              <Badge 
                variant="secondary" 
                className={`text-sm px-3 py-1 ${
                  calculatedALevelTotal > 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""
                }`}
              >
                {calculatedALevelTotal} points
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* O-Level Section */}
      <Card className="border-green-500/20 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-green-500" />
            O-Level Subjects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {oLevelSubjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden border-green-500/10 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="grid flex-1 gap-1.5">
                          <Label
                            htmlFor={`subject-${subject.id}`}
                            className="text-sm font-medium flex items-center gap-1"
                          >
                            Subject {index + 1}
                            {subject.name && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" />
                            )}
                          </Label>
                          <Select
                            value={subject.name}
                            onValueChange={(value) =>
                              updateSubject("o-level", subject.id, "name", value)
                            }
                          >
                            <SelectTrigger
                              id={`subject-${subject.id}`}
                              className={`bg-white dark:bg-gray-950 ${
                                subject.name ? "border-green-500/50" : ""
                              }`}
                            >
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Show the current selection first */}
                              {subject.name && (
                                <SelectItem key={subject.name} value={subject.name}>
                                  {subject.name}
                                </SelectItem>
                              )}
                              
                              {/* Then show remaining options */}
                              {remainingOLevelSubjects.map((subjectName) => (
                                <SelectItem key={subjectName} value={subjectName}>
                                  {subjectName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid w-full sm:w-32 gap-1.5">
                          <Label
                            htmlFor={`grade-${subject.id}`}
                            className="text-sm font-medium flex items-center gap-1"
                          >
                            Grade
                            {subject.grade && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-1" />
                            )}
                          </Label>
                          <Select
                            value={subject.grade}
                            onValueChange={(value) =>
                              updateSubject("o-level", subject.id, "grade", value)
                            }
                          >
                            <SelectTrigger
                              id={`grade-${subject.id}`}
                              className={`bg-white dark:bg-gray-950 ${
                                subject.grade ? "border-green-500/50" : ""
                              }`}
                            >
                              <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                            <SelectContent>
                              {gradeOptions["o-level"].map((grade) => (
                                <SelectItem key={grade} value={grade}>
                                  {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="self-end text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-10 w-10 rounded-full"
                                onClick={() => removeSubject("o-level", subject.id)}
                                disabled={oLevelSubjects.length <= 1}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove subject</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove subject</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      {/* Show points for this subject if both name and grade are selected */}
                      {subject.name && subject.grade && (
                        <div className="mt-2 text-right">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {gradePoints["o-level"][subject.grade as keyof typeof gradePoints["o-level"]]} points
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full mt-4 border-dashed border-green-500/50 hover:border-green-500 hover:bg-green-50 text-green-700"
            onClick={() => addSubject("o-level")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add O-Level Subject
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end mt-4">
            <div className="grid gap-1.5 flex-1">
              <Label htmlFor="o-level-points" className="text-sm font-medium flex items-center gap-1">
                O-Level Total Points (Optional)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Enter your total O-Level points if you already know them, otherwise we'll calculate them based on your subjects and grades.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="o-level-points"
                type="number"
                placeholder="Enter your total O-Level points if known"
                value={oLevelPoints}
                onChange={(e) => setOLevelPoints(e.target.value)}
                className="bg-white dark:bg-gray-950"
              />
            </div>

            <div className="flex items-center gap-2 min-w-[140px]">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Calculator className={`h-4 w-4 ${isCalculatingOLevel ? "animate-pulse text-green-500" : ""}`} />
                Calculated:
              </div>
              <Badge 
                variant="secondary" 
                className={`text-sm px-3 py-1 ${
                  calculatedOLevelTotal > 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : ""
                }`}
              >
                {calculatedOLevelTotal} points
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-lg font-medium shadow-md"
        disabled={!isFormValid}
      >
        Find Matching Courses
      </Button>
      
      {/* Form guidance */}
      <div className="text-sm text-gray-500 text-center">
        <p>Enter at least one subject with a grade to find matching courses.</p>
        <p className="mt-1">Make sure to select which level (A-Level or O-Level) you want to search with.</p>
      </div>
    </form>
  )
}
