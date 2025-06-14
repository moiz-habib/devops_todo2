from fastapi import APIRouter, HTTPException
from sqlmodel import select
from typing import Optional
from ..database import session
from ..models import Todo
from sqlmodel import SQLModel, Field

# Define an update model allowing partial updates
class TodoUpdate(SQLModel):
    text: Optional[str] = None
    done: Optional[bool] = None

router = APIRouter(prefix="/todos", tags=["todos"])

@router.post("/", response_model=Todo)
async def create_todo(todo: Todo):
    async with session as s:
        s.add(todo)
        await s.commit()
        await s.refresh(todo)
        return todo

@router.get("/", response_model=list[Todo])
async def list_todos():
    async with session as s:
        result = await s.exec(select(Todo))
        return result.all()

@router.put("/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, todo_update: TodoUpdate):
    async with session as s:
        todo = await s.get(Todo, todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Not found")
        # Only update provided fields
        if todo_update.text is not None:
            todo.text = todo_update.text
        if todo_update.done is not None:
            todo.done = todo_update.done
        s.add(todo)
        await s.commit()
        await s.refresh(todo)
        return todo

@router.delete("/{todo_id}")
async def delete_todo(todo_id: int):
    async with session as s:
        todo = await s.get(Todo, todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Not found")
        await s.delete(todo)
        await s.commit()
        return {"status": "deleted"}