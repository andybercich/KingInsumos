package org.example.Services;


import org.example.Repositories.BaseRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public abstract class BaseService<T, ID, Repo extends BaseRepository<T,ID>>{

    @Autowired
    protected Repo repository;

    public T save(T entity) throws Exception {
        try {
            return repository.save(entity);
        }catch (Exception e){throw new Exception(e.getMessage());}
    }

    public T findById(ID id) throws Exception {
        try {
            Optional<T> entity = repository.findById(id);
            return entity.orElse(null);
        }catch (Exception e){
            throw new Exception(e.getMessage());
        }

    }

    public List<T> findAll() throws Exception {
        try{
            return repository.findAll();
        }catch (Exception e){throw new Exception(e.getMessage());}

    }

    @Transactional
    public T update(ID id, T entity) throws Exception {
        try {
            T existingEntity = repository.findById(id)
                    .orElseThrow(() -> new Exception("Entity not found"));

            BeanUtils.copyProperties(entity, existingEntity, "id");

            return repository.saveAndFlush(existingEntity);

        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public T updateFields(T existingEntity, T entity) throws IllegalAccessException, NoSuchFieldException {
        Map<String, Object> fieldMap = new HashMap<>();

        for (Field field : existingEntity.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            fieldMap.put(field.getName(), field.get(existingEntity));
        }

        for (Field field : entity.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            if (field.get(entity) != null ) {
                fieldMap.put(field.getName(), field.get(entity));
            }
        }

        for (Map.Entry<String, Object> entry : fieldMap.entrySet()) {
            Field field = existingEntity.getClass().getDeclaredField(entry.getKey());
            field.setAccessible(true);
            field.set(existingEntity, entry.getValue());
        }
        return existingEntity;
    }

    public boolean deleteById(ID id) throws Exception {
        try {
            repository.deleteById(id);
            return true;
        }catch (Exception e){
            throw new Exception(e.getMessage());
        }

    }

}


