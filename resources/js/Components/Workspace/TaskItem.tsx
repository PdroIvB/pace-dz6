import { memo } from "react";

function TaskItem(props: any) {
    const { task, isDragging, isGroupedOver, provided, isClone, index } = props;

    return (
        <>
            <div
                // href={quote.author.url}
                // isDragging={isDragging}
                // isGroupedOver={isGroupedOver}
                // isClone={isClone}
                // colors={quote.author.colors}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                // style={getStyle(provided, style)}
                data-is-dragging={isDragging}
                data-testid={task.id}
                data-index={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-00 
                                            hover:shadow-md transition-shadow duration-200 cursor-pointer m-4"
                // aria-label={`${quote.author.name} quote ${quote.content}`}
            >
                {/* <Avatar src={quote.author.avatarUrl} alt={quote.author.name} /> */}
                {isClone ? <div>Clone</div> : null}
                <div>
                    <div>{task.description}</div>
                    <div>
                        <small /* colors={quote.author.colors} */>
                            {task.assignee?.name}
                        </small>
                        <small>
                            id:
                            {task.id}
                        </small>
                    </div>
                </div>
            </div>
        </>
    );
}

export default memo(TaskItem);
