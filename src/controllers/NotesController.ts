import type { Request, Response } from "express";
import Note, {INote} from "../models/Note";
import { Types } from "mongoose";

type NoteParams = {
    noteId: Types.ObjectId
}

export class NotesController{
    static createNote = async (req:Request<{},{}, INote>, res: Response) => {
        const {content} = req.body
        const note = new Note({
            content,
            createdBy: req.user._id,
            task: req.task._id
        })

        req.task.notes.push(note._id)

        try {
            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Note created succesfully')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static getTaskNotes = async (req:Request, res: Response) => {
        try {
            const notes = await Note.find({task: req.task._id})
            res.json(notes)
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static deleteNote = async (req:Request<NoteParams>, res: Response) => {
        const {noteId} = req.params
        const note = await Note.findById(noteId)

        if(!note){
            const error = new Error('Note not founded')
            return res.status(404).json({error: error.message})
        }

        if(note.createdBy.toString() !== req.user._id.toString()){
            const error = new Error('Action not validate')
            return res.status(401).json({error: error.message})
        }

        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())

        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()])
            res.send('Note deleted succesfully')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }
}