CREATE TRIGGER eliminar_eventos_si_ciclo_archivado
AFTER UPDATE OF archivado ON psicopedagogia_cicloacademico
FOR EACH ROW
WHEN NEW.archivado = 1 AND (OLD.archivado = 0 OR OLD.archivado IS NULL)
BEGIN
  DELETE FROM psicopedagogia_evento WHERE ciclo_academico_id = OLD.id;
END;
