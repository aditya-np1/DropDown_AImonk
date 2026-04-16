CREATE OR ALTER PROCEDURE sp_GetAllTrees
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        t.TreeID, 
        tg.TagID, 
        tg.ParentID, 
        tg.TagName, 
        tg.TagData
    FROM [dbo].[Trees] t
    LEFT JOIN [dbo].[Tags] tg ON t.TreeID = tg.TreeID
    ORDER BY t.TreeID, tg.ParentID;
END
GO	